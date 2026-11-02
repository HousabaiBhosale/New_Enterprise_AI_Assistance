import os
import uuid
import math
import hashlib
from dotenv import load_dotenv
load_dotenv()
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

# Check if QDRANT_URL is set, otherwise default to local embedded instance
QDRANT_URL = os.getenv("QDRANT_URL", None)
COLLECTION_NAME = "enterprise_docs"

client = None
if QDRANT_URL:
    try:
        test_client = QdrantClient(url=QDRANT_URL, timeout=2)
        test_client.get_collections()
        client = test_client
        print(f"Connected to remote Qdrant at {QDRANT_URL}")
    except Exception as e:
        print(f"Remote Qdrant unavailable ({e}). Falling back to local embedded store.")

if client is None:
    qdrant_path = os.path.join(os.path.dirname(__file__), "qdrant_data")
    try:
        if os.path.exists(qdrant_path):
            client = QdrantClient(path=qdrant_path)
        else:
            client = QdrantClient(":memory:")
    except Exception as e:
        print(f"Notice: local qdrant storage locked or unavailable ({e}). Using in-memory store.")
        client = QdrantClient(":memory:")

_fastembed_model = None

def get_embedding_vector(text: str, size: int = 384) -> list[float]:
    """Generates a 384-dimensional dense vector for semantic similarity.
    Uses FastEmbed if installed; otherwise falls back to a deterministic normalized hash-projection vector."""
    global _fastembed_model
    try:
        if _fastembed_model is None:
            from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
            _fastembed_model = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        return _fastembed_model.embed_query(text)
    except Exception:
        # High quality bag-of-words & n-gram deterministic hash embedding
        vec = [0.0] * size
        words = text.lower().replace(",", " ").replace(".", " ").replace("?", " ").split()
        for i, word in enumerate(words):
            # Unigram
            h1 = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            vec[h1 % size] += 1.0
            # Bigram
            if i + 1 < len(words):
                bigram = f"{word}_{words[i+1]}"
                h2 = int(hashlib.md5(bigram.encode('utf-8')).hexdigest(), 16)
                vec[h2 % size] += 1.5
                
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [float(x / norm) for x in vec]

def init_qdrant():
    collections = client.get_collections().collections
    exists = any(c.name == COLLECTION_NAME for c in collections)
    
    if not exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
        # Auto-ingest docs so in-memory or fresh collections are immediately populated
        ingest_documents()
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

def get_qdrant_client():
    init_qdrant()
    return client

def ingest_document_text(filename: str, content: str, title: str = "", category: str = "General") -> int:
    """Chunks text, computes embeddings, and stores points in Qdrant collection."""
    init_qdrant()
    
    if "## " in content:
        raw_chunks = content.split("\n## ")
        chunks = []
        if raw_chunks:
            if raw_chunks[0].strip():
                chunks.append(raw_chunks[0].strip())
            for c in raw_chunks[1:]:
                if c.strip():
                    chunks.append("## " + c.strip())
    else:
        paragraphs = content.split("\n\n")
        chunks = [p.strip() for p in paragraphs if len(p.strip()) > 30]
        if not chunks and content.strip():
            chunks = [content.strip()]
            
    points = []
    for chunk in chunks:
        vec = get_embedding_vector(chunk)
        points.append(PointStruct(
            id=str(uuid.uuid4()),
            vector=vec,
            payload={
                "source": filename,
                "title": title or filename,
                "category": category,
                "text": chunk
            }
        ))
        
    if points:
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Upserted {len(points)} vectorized chunks for {filename}.")
        
    return len(points)

def ingest_documents():
    """Reads markdown files from data/docs and indexes into Qdrant."""
    init_qdrant()
    docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
    if not os.path.exists(docs_dir):
        return

    for filename in os.listdir(docs_dir):
        if filename.endswith(".md") or filename.endswith(".txt"):
            filepath = os.path.join(docs_dir, filename)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                category = "HR" if "hr" in filename else ("Sales" if "sales" in filename else ("Support" if "support" in filename else "General"))
                ingest_document_text(filename=filename, content=content, title=filename.replace("_", " ").title(), category=category)

if __name__ == "__main__":
    ingest_documents()
