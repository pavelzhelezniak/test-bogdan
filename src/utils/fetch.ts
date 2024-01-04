export function createFetch<T>(input: RequestInfo | URL): () => Promise<T> {
  const dataFetch = async (): Promise<T> => {
    const response = await fetch(input);
    const data = await response.json();
    return data;
  };

  return dataFetch;
}
