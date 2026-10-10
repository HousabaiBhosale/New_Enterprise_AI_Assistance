from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
import os
import uuid

# Check if QDRANT_URL is set, otherwise default to local embedded instance
QDRANT_URL = os.getenv("QDRANT_URL", None)
COLLECTION_NAME = "enterprise_docs"

if QDRANT_URL:
    client = QdrantClient(url=QDRANT_URL)
else:
    client = QdrantClient(":memory:")

def init_qdrant():
    collections = client.get_collections().collections
    exists = any(c.name == COLLECTION_NAME for c in collections)
    
    if not exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

def get_qdrant_client():
    return client

def ingest_documents():
    """Reads markdown files from data/docs, embeds them, and stores in Qdrant."""
    print("Ingesting documents into Qdrant...")
    init_qdrant()
    
    docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
    if not os.path.exists(docs_dir):
        print("No documents directory found.")
        return

    embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
    
    points = []
    for filename in os.listdir(docs_dir):
        if filename.endswith(".md"):
            with open(os.path.join(docs_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Split content by H2 headers (##)
                chunks = content.split("\n## ")
                
                # Treat the first chunk (title/intro) specially
                if chunks:
                    first_chunk = chunks[0]
                    if first_chunk.strip():
                        vec = embeddings.embed_query(first_chunk)
                        points.append(PointStruct(
                            id=str(uuid.uuid4()),
                            vector=vec,
                            payload={"source": filename, "text": first_chunk, "topic": "intro"}
                        ))
                
                # Process the rest of the chunks
                for chunk in chunks[1:]:
                    if chunk.strip():
                        full_chunk = "## " + chunk
                        vec = embeddings.embed_query(full_chunk)
                        points.append(PointStruct(
                            id=str(uuid.uuid4()),
                            vector=vec,
                            payload={"source": filename, "text": full_chunk, "topic": chunk.split("\n")[0]}
                        ))
                        
    if points:
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Successfully ingested {len(points)} document chunks.")

if __name__ == "__main__":
    # If run directly, ingest the documents
    ingest_documents()
