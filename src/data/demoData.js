/**
 * Study Hub - Initial Demo Data
 * Contains sample tests and initial MCQs ready for instant testing & evaluation
 */

export const INITIAL_DEMO_TESTS = [
  {
    id: "mbbs-anatomy-101",
    title: "MBBS Anatomy Basic Test",
    subject: "Anatomy",
    description: "Fundamental assessment covering human organ systems, cardiovascular anatomy, musculoskeletal structures, and anatomical landmarks.",
    duration: 10, // minutes
    passingPercentage: 70,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q1",
        question: "Which organ pumps blood throughout the body?",
        options: {
          A: "Liver",
          B: "Heart",
          C: "Kidney",
          D: "Lung"
        },
        correctAnswer: "B",
        explanation: "The heart is the primary muscular organ that pumps oxygenated blood through the circulatory system to all body tissues."
      },
      {
        id: "q2",
        question: "What is the longest and strongest bone in the human body?",
        options: {
          A: "Tibia",
          B: "Humerus",
          C: "Femur",
          D: "Fibula"
        },
        correctAnswer: "C",
        explanation: "The femur (thighbone) is both the longest and strongest bone in the human skeletal system."
      },
      {
        id: "q3",
        question: "Which blood vessel carries oxygen-rich blood from the lungs back to the left atrium of the heart?",
        options: {
          A: "Pulmonary vein",
          B: "Pulmonary artery",
          C: "Superior vena cava",
          D: "Aorta"
        },
        correctAnswer: "A",
        explanation: "Unlike systemic veins, the pulmonary veins carry oxygenated blood from the lungs directly to the left atrium."
      },
      {
        id: "q4",
        question: "How many chambers does the normal human heart possess?",
        options: {
          A: "Two",
          B: "Three",
          C: "Four",
          D: "Five"
        },
        correctAnswer: "C",
        explanation: "The human heart consists of four chambers: right and left atria, and right and left ventricles."
      },
      {
        id: "q5",
        question: "Which part of the human brain controls vital vegetative functions such as breathing and heart rate?",
        options: {
          A: "Cerebrum",
          B: "Cerebellum",
          C: "Medulla oblongata",
          D: "Thalamus"
        },
        correctAnswer: "C",
        explanation: "The medulla oblongata within the brainstem regulates autonomic reflexes including respiration, cardiac rhythm, and blood pressure."
      },
      {
        id: "q6",
        question: "What is the primary anatomical structural unit of the human kidney?",
        options: {
          A: "Nephron",
          B: "Alveolus",
          C: "Neuron",
          D: "Hepatocyte"
        },
        correctAnswer: "A",
        explanation: "The nephron is the microscopic structural and functional unit of the kidney responsible for filtering blood and forming urine."
      },
      {
        id: "q7",
        question: "Which cranial nerve is responsible for the sense of smell?",
        options: {
          A: "Optic nerve (CN II)",
          B: "Olfactory nerve (CN I)",
          C: "Vagus nerve (CN X)",
          D: "Facial nerve (CN VII)"
        },
        correctAnswer: "B",
        explanation: "The olfactory nerve (Cranial Nerve I) transmits sensory impulses associated with the sense of smell."
      },
      {
        id: "q8",
        question: "Which muscle separates the thoracic cavity from the abdominal cavity and is essential for respiration?",
        options: {
          A: "Pectoralis major",
          B: "Diaphragm",
          C: "Rectus abdominis",
          D: "Latissimus dorsi"
        },
        correctAnswer: "B",
        explanation: "The diaphragm is the dome-shaped musculotendinous sheet separating the thorax and abdomen, serving as the main muscle of inspiration."
      },
      {
        id: "q9",
        question: "What is the normal total number of cervical vertebrae found in the human spine?",
        options: {
          A: "5",
          B: "7",
          C: "12",
          D: "4"
        },
        correctAnswer: "B",
        explanation: "There are 7 cervical vertebrae (C1-C7) in the human neck region."
      },
      {
        id: "q10",
        question: "Which digestive organ produces bile necessary for lipid emulsification?",
        options: {
          A: "Gallbladder",
          B: "Liver",
          C: "Pancreas",
          D: "Stomach"
        },
        correctAnswer: "B",
        explanation: "Bile is synthesized by hepatocytes in the liver and subsequently stored and concentrated in the gallbladder."
      }
    ]
  },
  {
    id: "cs-web-dev-201",
    title: "Web Development & JavaScript Essentials",
    subject: "Computer Science",
    description: "Core concepts of JavaScript, React lifecycle, DOM manipulation, asynchronous programming, and web standards.",
    duration: 15,
    passingPercentage: 65,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "js1",
        question: "Which JavaScript keyword is used to declare block-scoped variables that cannot be reassigned?",
        options: {
          A: "var",
          B: "let",
          C: "const",
          D: "static"
        },
        correctAnswer: "C",
        explanation: "'const' declares a block-scoped constant reference that cannot be reassigned through re-assignment."
      },
      {
        id: "js2",
        question: "In React, what hook is used to perform side effects such as data fetching or subscriptions?",
        options: {
          A: "useState",
          B: "useMemo",
          C: "useEffect",
          D: "useRef"
        },
        correctAnswer: "C",
        explanation: "'useEffect' lets you synchronize a component with an external system and perform side effects."
      },
      {
        id: "js3",
        question: "What does SPA stand for in modern web development architecture?",
        options: {
          A: "Single Page Application",
          B: "Server Page Adapter",
          C: "Synchronous Protocol Access",
          D: "Scripted Program Automation"
        },
        correctAnswer: "A",
        explanation: "SPA stands for Single Page Application, where content updates dynamically without full page reloads."
      },
      {
        id: "js4",
        question: "Which HTTP status code signifies that a requested resource was not found on the server?",
        options: {
          A: "200",
          B: "301",
          C: "404",
          D: "500"
        },
        correctAnswer: "C",
        explanation: "HTTP 404 Not Found indicates that the origin server did not find a current representation for the target resource."
      },
      {
        id: "js5",
        question: "What is the purpose of the 'vercel.json' SPA rewrite rule: [{\"source\": \"/(.*)\", \"destination\": \"/index.html\"}]?",
        options: {
          A: "To compress all JavaScript bundles into gzip",
          B: "To redirect all client-side routes to index.html to prevent 404 errors on reload",
          C: "To disable browser cache for all assets",
          D: "To enforce server-side rendering for search bots"
        },
        correctAnswer: "B",
        explanation: "Vercel SPA rewrite directs all requests to index.html so React Router can resolve the URL on the client without 404 errors."
      }
    ]
  }
];

export const INITIAL_DEMO_RESULTS = [
  {
    id: "sample-res-1",
    userId: "demo-student-id",
    studentName: "Alex Rivera",
    testId: "mbbs-anatomy-101",
    testName: "MBBS Anatomy Basic Test",
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    status: "PASS",
    timeTaken: 380, // seconds
    answers: {
      q1: "B",
      q2: "C",
      q3: "A",
      q4: "C",
      q5: "C",
      q6: "A",
      q7: "B",
      q8: "B",
      q9: "B",
      q10: "A" // wrong, chose Gallbladder instead of Liver
    },
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
