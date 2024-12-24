import { useState , useEffect} from 'react'
import './App.css'

function App() {
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const res = await fetch("http://localhost:9200/logs_index/_search?pretty&size=10", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            match: {
              "level": searchTerm,
            },
          },
        }),
      })
      const data = await res.json()
      console.log(data)
      setSearchResults(data.hits.hits)
      setLoading(false)
    }

    if (searchTerm) {
      fetchResults()
    }
    
  }, [searchTerm])

  return (
    <div className="App">
      <h1>Search for logs</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for logs"
      />
      {loading && <p>Loading...</p>}
      {searchResults.map((result: any) => (
        <div key={result._id}>
          <h2>{result._source.message}</h2>
          <p>{result._source.timestamp}</p>
        </div>
      ))}
    </div>
  )
}

export default App
