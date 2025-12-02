import httpClient from './http.js';

class ToolService {
    
    async initializeDataIfEmpty() {
        try {
            const response = await httpClient.get('/tools'); 
            
            if (response.data.length === 0) {
                console.warn("API returned empty tool list. Initializing mock data...");
                const mockTools = [
                    { id: "bubble-sort", name: "Bubble Sort", tags: ["sort", "inefficient"], snippet: "function bubbleSort(arr) { \n  for(let i=0; i < arr.length; i++) {\n    for(let j=0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j+1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n      }\n    }\n  }\n}", rating: 3.5, description: "O(n^2) algorithm." },
                    { id: "quick-sort", name: "Quick Sort", tags: ["sort", "efficient"], snippet: "function quickSort(arr) { \n  if (arr.length <= 1) return arr;\n  let pivot = arr[0];\n  let left = [];\n  //...\n}", rating: 4.8, description: "O(n log n) algorithm." },
                    { id: "array-map", name: "Array Map Transformation", tags: ["array", "js"], snippet: "const newArray = arr.map(item => item * 2);", rating: 4.5, description: "Transforms array elements." },
                    
                    { id: "async-await", name: "Async/Await with TryCatch", tags: ["async", "error"], snippet: "async function fetchData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}", rating: 4.9, description: "Modern async error handling." },
                    { id: "debounce", name: "Debounce Function", tags: ["performance", "js"], snippet: "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(this, args), delay); }; };", rating: 4.6, description: "Limits function calls." },
                    { id: "closure", name: "Closure Counter", tags: ["js", "pattern"], snippet: "function createCounter() {\n  let count = 0;\n  return () => ++count;\n}", rating: 4.2, description: "Example of a closure." },

                    { id: "memoize", name: "Memoize Function", tags: ["caching", "performance"], snippet: "function memoize(fn) {\n  const cache = {};\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache[key]) return cache[key];\n    const result = fn.apply(this, args);\n    cache[key] = result;\n    return result;\n  };\n}", rating: 4.7, description: "Caches results of expensive function calls." },
                    { id: "url-parser", name: "URL Query Parser", tags: ["browser", "utility"], snippet: "const params = new URLSearchParams(window.location.search);\nconst id = params.get('id');", rating: 4.0, description: "Extracts URL query parameters." },
                    { id: "proxy-ex", name: "Proxy Usage Example", tags: ["meta", "js"], snippet: "const handler = { get: (target, property) => {  return target[property]; } };\nconst proxy = new Proxy(target, handler);", rating: 4.3, description: "Interception logic for object properties." },
                    { id: "fetch-data", name: "Modern Fetch API", tags: ["http", "async"], snippet: "async function getData(url) {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(response.statusText);\n  return response.json();\n}", rating: 4.8, description: "Robust data fetching mechanism." },
                ];
                
                for (const tool of mockTools) {
                    await httpClient.post('/tools', tool);
                }
                
                console.log("Mock data initialized successfully.");
            }
        } catch (error) {
            console.error("Failed to initialize mock data (API check failed):", error);
        }
    }

    async fetchTools(params = {}) {
        try {
            const response = await httpClient.get('/tools', { params });
            
            const totalCount = response.data.length;

            console.log("API returned Total Count (Full List Mode):", totalCount); 

            return {
                tools: response.data,
                totalCount: totalCount,
            };
        } catch (error) {
            console.error('Error fetching tools:', error);
            throw new Error('Failed to load tools from API. Please check server status.');
        }
    }

    async fetchToolById(id) {
        try {
            const response = await httpClient.get(`/tools/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching tool ${id}:`, error);
            throw new Error(`Failed to load tool ${id}.`);
        }
    }

    async submitTool(toolData) {
        try {
            const response = await httpClient.post('/submissions', {
                ...toolData,
                timestamp: Date.now(),
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting tool:', error);
            throw new Error('Failed to submit tool data.');
        }
    }
}

export const toolService = new ToolService();