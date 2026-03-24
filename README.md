# ⎈ KubeQuest

**Kubernetes Training Simulator** — Learn and test your K8s knowledge through a gamified interactive quiz.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Features

- **3 difficulty levels**: Recruit, Engineer, Architect
- **4 question types**: MCQ, True/False, Ordering, Type-in
- **60+ questions** covering the entire Kubernetes ecosystem
- **Scoring system** with combos, timer, and lives
- **Fine-grained grading** from S to D (12 grades)
- **Local history** of the last 10 games (localStorage)
- **100% client-side** — no backend required

## Topics Covered

| Category | Examples |
|----------|----------|
| Architecture | Control plane, etcd, kubelet, API Server |
| Workloads | Deployments, StatefulSets, DaemonSets, CronJobs |
| Networking | Services, Ingress, CNI, NetworkPolicies, CoreDNS |
| Security | RBAC, PSA, Secrets, ServiceAccounts, AuthN/AuthZ |
| Scheduling | Taints/Tolerations, Affinity, Preemption, QoS |
| Config | ConfigMaps, Secrets, PV/PVC |
| Debugging | CrashLoopBackOff, Pending, OOMKilled |
| Commands | kubectl logs, exec, rollout, describe |

## Project Structure

```
kubequest/
├── index.html          # Main page
├── css/
│   └── style.css       # Styles (sci-fi HUD theme)
├── js/
│   ├── questions.js    # Question bank (3 levels)
│   └── game.js         # Game logic
├── LICENSE
└── README.md
```

## Deployment

### GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings > Pages**
3. Source: **Deploy from a branch** → `main` / `/ (root)`
4. The site will be available at `https://<username>.github.io/kubequest/`

### Local

Open `index.html` in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

## Adding Questions

Edit `js/questions.js` and add objects to the desired level's array:

```javascript
// MCQ
{
  type: 'qcm',
  category: 'Architecture',
  question: "Your question here?",
  hint: 'Optional hint',                       // optional
  options: ['A', 'B', 'C', 'D'],
  answer: 1,                                    // 0-based index
  explain: "Detailed explanation.",
  code: "kubectl get pods"                      // optional
}

// True/False
{ type: 'tf', category: 'Concepts', question: "...", answer: true, explain: "..." }

// Ordering
{ type: 'order', category: 'Workloads', question: "...", items: ['A','B','C'], answer: [0,1,2], explain: "..." }

// Type-in
{ type: 'fill', category: 'Commands', question: "...", answer: 'kubectl', alts: ['k'], explain: "..." }
```

## License

MIT
