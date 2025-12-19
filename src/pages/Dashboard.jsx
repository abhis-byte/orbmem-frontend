import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import "../components/Navbar.jsx"

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard fade-in">
      {/* --- Dashboard Header Section --- */}
      <header className="dashboard-header">
        <h2>Orbmem Documentation</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/pricing")}
        >
          Get API Key
        </button>
      </header>

      {/* --- Main Documentation Section --- */}
      <main className="docs">
        <h1>Orbmem – The Memory & Reasoning Backend for AI</h1>

        <p>
          Orbmem is <strong>not a chatbot</strong>.
        </p>
        <p>Orbmem is a <strong>backend brain</strong> for AI applications.</p>

        <p>It provides:</p>
        <ul>
          <li>🧠 Long-term per-user memory</li>
          <li>🔍 Vector (semantic) search</li>
          <li>🕸 Graph reasoning</li>
          <li>🛡 Built-in safety scanning</li>
          <li>🔐 Strict user isolation (multi-tenant by design)</li>
        </ul>

        <p>
          Orbmem is meant to be used <strong>behind</strong> chatbots, agents, copilots,
          tutors, and AI apps.
        </p>

        <h2>Why Orbmem Exists</h2>
        <p>Most AI apps today:</p>
        <ul>
          <li>Forget everything after a session</li>
          <li>Mix data between users</li>
          <li>Have no safety layer</li>
          <li>Cannot reason over relationships</li>
        </ul>
        <p>
          Orbmem solves this by acting as a <strong>stateful cognitive database</strong>.
        </p>

        <h2>Architecture (Simple)</h2>
        <pre>
{`AI App / Agent
    ↓
Orbmem API
  ├── Memory Engine (KV + TTL + Sessions)
  ├── Vector Engine (Semantic Search)
  ├── Graph Engine (Reasoning Paths)
  └── Safety Engine (Content Scanning)`}
        </pre>
        <p>Each user is <strong>fully isolated</strong> by Firebase UID.</p>

        <h2>Requirements</h2>
        <ul>
          <li>Python 3.10+</li>
          <li>Orbmem running locally or in cloud mode</li>
          <li>Valid:</li>
          <ul>
            <li>API Key</li>
            <li>Firebase ID Token</li>
          </ul>
        </ul>

        <h2>Quick Demo (End-to-End)</h2>
        <p>All examples below are <strong>real and tested</strong>.</p>

        <p>Base URL:</p>
        <pre>
{`http://127.0.0.1:8000`}
        </pre>

        <p>Headers used everywhere:</p>
        <ul>
          <li><code>Authorization: Bearer YOUR_API_KEY</code></li>
          <li><code>X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN</code></li>
        </ul>

        <h3>1️⃣ Store Memory</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/memory/set \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "key": "goal",
  "value": {
    "text": "Crack JEE and stay faithful"
  }
}'`}
        </pre>
        <p>Response:</p>
        <pre>
{`{
  "status": "ok",
  "key": "goal"
}`}
        </pre>

        <h3>2️⃣ Retrieve Memory</h3>
        <pre>
{`curl "http://127.0.0.1:8000/v1/memory/get?key=goal" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN"`}
        </pre>
        <p>Response:</p>
        <pre>
{`{
  "key": "goal",
  "value": {
    "text": "Crack JEE and stay faithful"
  }
}`}
        </pre>

        <h3>3️⃣ List All Memory Keys</h3>
        <pre>
{`curl http://127.0.0.1:8000/v1/memory/keys \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN"`}
        </pre>
        <p>Response:</p>
        <pre>
{`{
  "keys": ["goal"]
}`}
        </pre>

        <h3>4️⃣ Store Memory With TTL (Auto Expiry)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/memory/set \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "key": "temp",
  "value": { "note": "expires soon" },
  "ttl": 10
}'`}
        </pre>
        <p>This key will auto-delete after 10 seconds.</p>

        <h3>5️⃣ Vector Add (Semantic Memory)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/vector/add \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "id": "doc1",
  "text": "Jesus gives peace and strength"
}'`}
        </pre>

        <h3>6️⃣ Vector Search (Meaning-Based)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/vector/search \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "query": "peace",
  "k": 3
}'`}
        </pre>
        <p>Response:</p>
        <pre>
{`{
  "results": [
    {
      "score": 0.92,
      "payload": {
        "id": "doc1",
        "user_id": "YOUR_UID"
      }
    }
  ]
}`}
        </pre>

        <h3>7️⃣ Graph Reasoning (Steps / Knowledge)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/graph/add_step \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "node_id": "faith",
  "content": "Trust in God"
}'`}
        </pre>

        <h3>8️⃣ Safety Scan</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/safety/scan \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "X-Firebase-Token: YOUR_FIREBASE_ID_TOKEN" \\
-d '{
  "text": "I feel angry and lost"
}'`}
        </pre>
        <p>Response:</p>
        <pre>
{`{
  "input": "I feel angry and lost",
  "events": []
}`}
        </pre>

        <h2>Who Should Use Orbmem?</h2>
        <ul>
          <li>AI Chatbot developers</li>
          <li>AI agent frameworks</li>
          <li>Personal AI assistants</li>
          <li>Mental health / journaling apps</li>
          <li>Educational AI tutors</li>
          <li>Multi-user SaaS AI products</li>
        </ul>

        <h2>What Orbmem Is NOT</h2>
        <ul>
          <li>❌ Not an LLM</li>
          <li>❌ Not a UI</li>
          <li>❌ Not a chatbot</li>
        </ul>
        <p>Orbmem is the memory + reasoning layer.</p>

        <h2>Status</h2>
        <ul>
          <li>Production-ready core</li>
          <li>Actively developed</li>
          <li>Open for extension (plugins, policies, analytics)</li>
        </ul>

        <h2>Final Note</h2>
        <p>
          <em>If your AI needs:</em>
        </p>
        <ul>
          <li>Memory</li>
          <li>Meaning</li>
          <li>Structure</li>
          <li>Safety</li>
        </ul>
        <p>Orbmem is the foundation.</p>

        <h1>OrbMem Demo — Beyond Storage</h1>
        <p>OrbMem is not just a database. It is a <strong>cognitive layer</strong> for AI systems.</p>
        <p>
          This demo shows how memory, vectors, safety, and graphs work together to form{" "}
          <em>stateful, trustworthy AI</em>.
        </p>

        <h2>Scenario 1: AI Tutor That Remembers a Student</h2>

        <h3>Problem</h3>
        <p>Traditional LLMs:</p>
        <ul>
          <li>Forget past mistakes</li>
          <li>Lose context across sessions</li>
          <li>Cannot track learning progress</li>
          <li>Miss emotional signals</li>
        </ul>
        <p>OrbMem solves this with <strong>layered memory</strong>.</p>

        <h3>Step 1: Store a learning interaction (session memory)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/memory/set \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "X-Firebase-Token: <FIREBASE_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "math-mistake",
    "value": {
      "topic": "trigonometry",
      "error": "sin²θ + cos²θ misunderstood"
    },
    "session_id": "student-session-1"
  }'`}
        </pre>
        <p>This memory:</p>
        <ul>
          <li>Is user-scoped</li>
          <li>Is session-aware</li>
          <li>Can expire automatically (TTL)</li>
        </ul>

        <h3>Step 2: Add conceptual knowledge to vector memory</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/vector/add \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "X-Firebase-Token: <FIREBASE_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "trig-identity",
    "text": "sin²θ + cos²θ = 1 is a fundamental trigonometric identity"
  }'`}
        </pre>

        <h3>Step 3: Retrieve relevant context during a new question</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/vector/search \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "X-Firebase-Token: <FIREBASE_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "why sin square plus cos square",
    "k": 3
  }'`}
        </pre>
        <p>The AI now:</p>
        <ul>
          <li>Knows what the student struggled with</li>
          <li>Retrieves the right concept</li>
          <li>Responds with continuity</li>
        </ul>

        <h3>Step 4: Detect emotional distress (safety layer)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/safety/scan \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "X-Firebase-Token: <FIREBASE_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "I feel confused and frustrated with math"
  }'`}
        </pre>
        <p>OrbMem enables AI to:</p>
        <ul>
          <li>Detect emotional signals</li>
          <li>Adjust tone or escalate support</li>
          <li>Remain ethical by design</li>
        </ul>

        <h3>Step 5: Track reasoning steps (graph memory)</h3>
        <pre>
{`curl -X POST http://127.0.0.1:8000/v1/graph/add_step \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "X-Firebase-Token: <FIREBASE_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "node_id": "trigonometry",
    "content": "Student struggled with identity, revised with explanation"
  }'`}
        </pre>
        <p>This enables:</p>
        <ul>
          <li>Analytics</li>
          <li>Learning path visualization</li>
          <li>Explainable AI behavior</li>
        </ul>

        <h2>Why This Matters</h2>
        <p>OrbMem replaces:</p>
        <ul>
          <li>Ad-hoc Redis hacks</li>
          <li>Fragile prompt stuffing</li>
          <li>Disconnected vector stores</li>
          <li>Unsafe stateless AI</li>
        </ul>
        <p>With:</p>
        <ul>
          <li>✅ Memory</li>
          <li>✅ Meaning</li>
          <li>✅ Safety</li>
          <li>✅ Traceability</li>
        </ul>
        <p>All wired together.</p>

        <h2>Orbmem vs Typical AI Stack</h2>
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Typical Stack</th>
              <th>Orbmem</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>User isolation</td>
              <td>Manual, error-prone</td>
              <td><strong>Enforced by design</strong></td>
            </tr>
            <tr>
              <td>Long-term memory</td>
              <td>Redis hacks</td>
              <td><strong>Native KV + TTL + Sessions</strong></td>
            </tr>
            <tr>
              <td>Semantic recall</td>
              <td>External vector DB</td>
              <td><strong>Integrated + user-scoped</strong></td>
            </tr>
            <tr>
              <td>Reasoning paths</td>
              <td>Not tracked</td>
              <td><strong>Graph memory built-in</strong></td>
            </tr>
            <tr>
              <td>Safety</td>
              <td>Stateless moderation</td>
              <td><strong>Stateful safety layer</strong></td>
            </tr>
            <tr>
              <td>Cross-engine awareness</td>
              <td>None</td>
              <td><strong>All engines wired together</strong></td>
            </tr>
            <tr>
              <td>Debuggability</td>
              <td>Very hard</td>
              <td><strong>Explainable by data</strong></td>
            </tr>
          </tbody>
        </table>

        <p>
          Orbmem is <em>not more tools</em> — it is <strong>fewer tools, wired correctly.</strong>
        </p>

        <h2>What Orbmem Unlocks</h2>

        <h3>🧠 1. True Stateful AI</h3>
        <p>Your AI can:</p>
        <ul>
          <li>Remember across days, weeks, months</li>
          <li>Accumulate understanding</li>
          <li>Improve behavior over time</li>
          <li>Not by prompts — by <strong>data continuity</strong>.</li>
        </ul>

        <h3>🧭 2. Explainable Decisions</h3>
        <p>Because reasoning steps are stored:</p>
        <ul>
          <li>You can trace why an AI responded</li>
          <li>You can visualize learning paths</li>
          <li>You can debug AI behavior like software</li>
        </ul>
        <p>This is <strong>mandatory</strong> for:</p>
        <ul>
          <li>Education</li>
          <li>Healthcare</li>
          <li>Enterprise AI</li>
        </ul>

        <h3>🛡 3. Long-Horizon Safety</h3>
        <p>Orbmem allows:</p>
        <ul>
          <li>Detecting emotional trends</li>
          <li>Identifying repeated distress</li>
          <li>Enforcing policy over time</li>
        </ul>
        <p>Safety becomes <strong>predictive</strong>, not reactive.</p>

        <h3>🧩 4. Multi-Agent & Tool Memory (Future-Ready)</h3>
        <p>Orbmem’s model naturally supports:</p>
        <ul>
          <li>Agent-to-agent shared memory (scoped)</li>
          <li>Tool execution traces</li>
          <li>Chain-of-thought–like graph storage (without leaking prompts)</li>
        </ul>
        <p>This makes it ideal for:</p>
        <ul>
          <li>Autonomous agents</li>
          <li>Copilots</li>
          <li>Workflow AI</li>
        </ul>

        <h2>When You SHOULD Use Orbmem</h2>
        <p>Orbmem is a strong fit if:</p>
        <ul>
          <li>You have <strong>multiple users</strong></li>
          <li>Memory must persist across sessions</li>
          <li>You care about <strong>safety or trust</strong></li>
          <li>You need <strong>auditability</strong></li>
          <li>You’re building a product, not a demo</li>
        </ul>

        <h2>When You Should NOT Use Orbmem</h2>
        <p>Orbmem is probably <strong>overkill</strong> if:</p>
        <ul>
          <li>You’re doing a one-off script</li>
          <li>You only need stateless completions</li>
          <li>You don’t care about memory or safety</li>
          <li>You want zero backend complexity</li>
        </ul>
        <p>Orbmem is <strong>infrastructure</strong>, not a shortcut.</p>

        <h2>Adoption Pattern (How Teams Use It)</h2>

        <h3>Stage 1 — Memory Only</h3>
        <p>Use Orbmem as:</p>
        <ul>
          <li>A safer Redis replacement</li>
          <li>Per-user memory store</li>
        </ul>

        <h3>Stage 2 — Memory + Vectors</h3>
        <p>Add:</p>
        <ul>
          <li>Semantic recall</li>
          <li>Context enrichment for LLM prompts</li>
        </ul>

        <h3>Stage 3 — Full Cognitive Layer</h3>
        <p>Enable:</p>
        <ul>
          <li>Safety scanning</li>
          <li>Graph reasoning</li>
          <li>Analytics & tracing</li>
        </ul>
        <p>Orbmem grows <strong>with</strong> your product.</p>

        <h2>Design Philosophy</h2>
        <p>Orbmem follows three strict principles:</p>
        <ol>
          <li><strong>Isolation first</strong> – Multi-tenant safety is non-negotiable.</li>
          <li><strong>State beats prompts</strong> – Data &gt; clever prompt engineering.</li>
          <li><strong>Opinionated &gt; configurable</strong> – Fewer choices, fewer mistakes.</li>
        </ol>
        <p>This is why Orbmem feels “solid” rather than flashy.</p>

        <h2>Using Orbmem in Your Code</h2>
        <p>
          Once you have an API key, Orbmem is used <strong>from your backend code</strong>, not directly
          from browsers.
        </p>
        <p>You must send:</p>
        <ul>
          <li>Your API key</li>
          <li>A Firebase ID token (auto-refreshed)</li>
        </ul>

        <h3>How Authentication Works</h3>
        <p>Orbmem uses <strong>two layers</strong>:</p>

        <p><strong>1. Firebase (Dashboard only)</strong></p>
        <ul>
          <li>Used to identify who owns API keys</li>
          <li>Required only in the web app</li>
          <li>Not required when using the API itself</li>
        </ul>

        <p><strong>2. API Key (Actual API usage)</strong></p>
        <ul>
          <li>Used by your backend / scripts / servers</li>
          <li>Never expires unless you revoke it</li>
          <li>Sent as <code>Authorization: Bearer &lt;API_KEY&gt;</code></li>
        </ul>
        <p>Once you have an API key, Firebase is no longer involved.</p>

        <h3>Creating an API Key</h3>
        <ul>
          <li>Log in to the dashboard</li>
          <li>Go to API Keys</li>
          <li>Generate a key</li>
          <li>Copy it immediately (shown only once)</li>
        </ul>
        <p>For security reasons, raw API keys are never shown again.</p>

        <h3>Using Orbmem APIs</h3>
        <p><strong>Base URL:</strong></p>
        <pre>
{`https://your-domain.com/v1`}
        </pre>

        <h3>🔑 Authentication Header</h3>
        <pre>
{`Authorization: Bearer orbynt-xxxxxxxxxxxxxxxx`}
        </pre>

        <h3>📦 Python Example</h3>
        <pre>
{`import requests

API_KEY = "orbynt-xxxxxxxxxxxxxxxx"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Store memory
res = requests.post(
    "https://your-domain.com/v1/memory/set",
    headers=headers,
    json={
        "key": "user_name",
        "value": "Abhishek"
    }
)

print(res.json())`}
        </pre>

        <h3>📦 JavaScript (Node.js)</h3>
        <pre>
{`const fetch = require("node-fetch");

const API_KEY = "orbynt-xxxxxxxxxxxxxxxx";

fetch("https://your-domain.com/v1/memory/get?key=user_name", {
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`
  }
})
.then(res => res.json())
.then(console.log);`}
        </pre>

        <h3>📦 cURL</h3>
        <pre>
{`curl -X POST https://your-domain.com/v1/memory/set \\
  -H "Authorization: Bearer orbynt-xxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "mood",
    "value": "happy"
  }'`}
        </pre>

        <h3>🔍 Vector Search</h3>
        <pre>
{`POST /v1/vector/search
{
  "query": "What is my user's name?",
  "k": 5
}`}
        </pre>

        <h3>🕸 Graph Reasoning</h3>
        <pre>
{`POST /v1/graph/add_step
{
  "node_id": "idea_1",
  "content": "Orbmem is a memory backend"
}`}
        </pre>

        <h3>🛡 Safety Scanning</h3>
        <pre>
{`POST /v1/safety/scan
{
  "text": "Some user input"
}`}
        </pre>

        <h3>🔐 Security Notes</h3>
        <ul>
          <li>API keys are hashed in the database</li>
          <li>Raw keys are never stored</li>
          <li>Every request is isolated per user</li>
          <li>Rate limits can be enabled later</li>
        </ul>

        <h3>✅ Best Practices</h3>
        <ul>
          <li>Use Orbmem from server-side code</li>
          <li>Never expose API keys in frontend JS</li>
          <li>Rotate keys if compromised</li>
          <li>Treat API keys like passwords</li>
        </ul>

        <h3>❓ FAQ</h3>
        <p><strong>Q: Does my API key expire?</strong></p>
        <p>A: Yes (based on your plan).</p>

        <p><strong>Q: Do I need Firebase in my backend?</strong></p>
        <p>A: No. Only the API key is required.</p>

        <p><strong>Q: Can users generate multiple keys?</strong></p>
        <p>A: No.</p>

        <h2>🎯 Final Summary</h2>
        <p>Orbmem is:</p>
        <ul>
          <li>Simple to use</li>
          <li>Secure by design</li>
          <li>Built for serious AI systems</li>
        </ul>
      </main>

      {/* --- Dashboard Access/CTA Section (if you still want it) --- */}
      <div className="dashboard-access fade-in">
        <h1>Orbmem Dashboard</h1>
        <p>Your account is verified.</p>

        <button
          className="primary"
          onClick={() => navigate("/pricing")}
        >
          Get API Key
        </button>

        <p className="note">API access requires active subscription.</p>
      </div>
    </div>
  );
}
