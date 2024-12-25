import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import './App.css';
import "react-datetime/css/react-datetime.css";

function App() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ [key: string]: string | { gte?: string; lte?: string } }>({});
  const [currentFilterKey, setCurrentFilterKey] = useState<string>('level');
  const [currentFilterValue, setCurrentFilterValue] = useState<string | { gte?: string; lte?: string }>('');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const res = await fetch('http://localhost:9200/logs_index/_search?pretty&size=100', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            bool: {
              must: Object.entries(filters).map(([key, value]) => {
                if (key === 'timestamp' && typeof value === 'object') {
                  const rangeFilter: { gte?: string; lte?: string } = {};
                  if (value.gte) rangeFilter.gte = value.gte;
                  if (value.lte) rangeFilter.lte = value.lte;
                  return { range: { [key]: rangeFilter } };
                }
                return { match: { [key]: value } };
              }),
            },
          },
        }),
      });
      const data = await res.json();
      setSearchResults(data.hits?.hits || []);
      setLoading(false);
    };

    if (Object.keys(filters).length > 0) {
      fetchResults();
    }
  }, [filters]);

  const handleAddFilter = () => {
    if (currentFilterKey === 'timestamp' && typeof currentFilterValue === 'object') {
      const updatedFilter = {
        ...filters[currentFilterKey],
        ...(currentFilterValue.gte ? { gte: currentFilterValue.gte } : {}),
        ...(currentFilterValue.lte ? { lte: currentFilterValue.lte } : {}),
      };

      if (!updatedFilter.gte && !updatedFilter.lte) {
        handleRemoveFilter('timestamp');
      } else {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [currentFilterKey]: updatedFilter,
        }));
      }
    } else if (currentFilterKey && currentFilterValue) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [currentFilterKey]: currentFilterValue as string,
      }));
    }
    setCurrentFilterValue('');
  };

  const handleRemoveFilter = (key: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <div className="App">
      <h1>Search Logs</h1>
      <div className="filters">
        <h3>Apply Filters</h3>
        <select
          value={currentFilterKey}
          onChange={(e) => setCurrentFilterKey(e.target.value)}
        >
          <option value="level">Level</option>
          <option value="message">Message</option>
          <option value="resourceId">Resource ID</option>
          <option value="timestamp">Timestamp</option>
          <option value="traceId">Trace ID</option>
          <option value="spanId">Span ID</option>
          <option value="commit">Commit</option>
          <option value="metadata.parentResourceId">Parent Resource ID</option>
        </select>
        {currentFilterKey === 'timestamp' ? (
          <div>
            <label>
              Greater than:
              <Datetime
                value={(currentFilterValue as { gte?: string }).gte || ''}
                onChange={(date) =>
                  setCurrentFilterValue((prev) => ({
                    ...(prev as { gte?: string; lte?: string }),
                    gte: date ? date.toISOString() : null,
                  }))
                }
                isClearable
              />
            </label>

            <label>
              Less than:
              <Datetime
                value={(currentFilterValue as { lte?: string }).lte || ''}
                onChange={(date) =>
                  setCurrentFilterValue((prev) => ({
                    ...(prev as { gte?: string; lte?: string }),
                    lte: date ? date.toISOString() : null,
                  }))
                }
                isClearable
              />
            </label>
          </div>
        ) : (
          <input
            type="text"
            value={currentFilterValue as string}
            onChange={(e) => setCurrentFilterValue(e.target.value)}
            placeholder={`Enter value for ${currentFilterKey}`}
          />
        )}
        <button onClick={handleAddFilter}>Add Filter</button>
      </div>

      <div className="active-filters">
        <h4>Active Filters:</h4>
        {Object.entries(filters).map(([key, value]) => (
          <span key={key}>
            {key}: {typeof value === 'object' ? JSON.stringify(value) : value}{' '}
            <button onClick={() => handleRemoveFilter(key)}>x</button>
          </span>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      <div className="results">
        {searchResults?.length > 0 ? (
          searchResults.map((result: any) => (
            <div key={result._id} className="result">
              <p> message: {result._source.message}</p>
              <p>level: {result._source.level}</p>
              <p>resourceId: {result._source.resourceId}</p>
              <p>traceId: {result._source.traceId}</p>
              <p>spanId: {result._source.spanId}</p>
              <p>commit: {result._source.commit}</p>
              <p>parentResourceId: {result._source.metadata.parentResourceId}</p>
              <p>timestamp: {result._source.timestamp}</p>
            </div>
          ))
        ) : filters.length ? (
          <p>No results found</p>
        ) : null
        }
      </div>
    </div>
  );
}

export default App;
