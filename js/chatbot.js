// Chatbot for Leoson Hoay's Resume Website
// Integrates with OpenAI and Claude APIs

class LeosonChatbot {
  constructor() {
    this.isOpen = false;
    this.apiProvider = null;
    this.apiKey = null;
    this.conversationHistory = [];
    
    // Knowledge base about Leoson Hoay extracted from the resume
    this.knowledgeBase = {
      personal: {
        name: "Leoson Hoay",
        email: "leoson@uchicago.edu",
        location: "Singapore (currently), with experience in United States and Australia",
        description: "A large part of my work and research involves applying the scientific method to engineer insights about our chaotic world. My career path has been neither straight nor narrow, walking the line between computer science, the social sciences, and the humanities for many years. I am most passionate about leveraging advances in technology and analytics to solve human problems, and bringing these fields closer together."
      },
      
      currentRole: {
        title: "Consultant (Data Science & AI)",
        company: "Diffusion Venture Studio",
        period: "Mar 2025 - Present",
        description: "Data Science and AI consulting to help align capital, deep-sector knowledge, and data-driven research with scalable solution partners in Education."
      },
      
      experience: [
        {
          title: "Data Scientist",
          company: "Learning Collider",
          period: "Nov 2022 - Nov 2024",
          description: "Developing statistical analysis and machine learning models on partner data platforms to accelerate equity in education and housing."
        },
        {
          title: "Technical Lead and Lead Data Scientist",
          company: "University of Chicago Urban Labs",
          period: "Mar 2018 - Oct 2022",
          description: "Lead the development of data science and analytic talent at the Health Lab. Provide analytic and data science support to various projects in the lab, working with partners such as the Illinois Department of Public Health and the Chicago Children's Advocacy Center in leveraging statistical models and developing analytical tools to evaluate public health policies and interventions."
        },
        {
          title: "Data Engineer",
          company: "University of Chicago",
          period: "Apr 2019 - Sep 2019",
          description: "Developed ETL workflows, supported data curation tasks, working mostly with Airflow and cloud platforms such as AWS and Google Cloud."
        }
      ],
      
      education: [
        {
          institution: "Georgia Institute of Technology",
          degree: "Master of Science, Computer Science",
          period: "August 2021 - May 2025",
          specialization: "Computer Vision · Machine Learning · Robotics"
        },
        {
          institution: "University of Chicago",
          degree: "Master of Arts, Computational Social Science",
          period: "August 2017 - June 2019",
          specialization: "Causal Inference · Machine Learning · NLP · Computational Linguistics · Databases"
        },
        {
          institution: "National University of Singapore",
          degree: "Bachelor of Social Sciences (Honors)",
          period: "August 2012 - December 2016",
          specialization: "Communications & New Media · Psychology"
        }
      ],
      
      skills: [
        "Data Science", "Machine Learning", "Causal Inference", "Computer Vision", 
        "Natural Language Processing", "Statistical Analysis", "Python", "R", 
        "SQL", "Cloud Computing (AWS, Google Cloud)", "ETL Workflows", "Airflow",
        "Public Health Analytics", "Educational Technology", "Research", "Analytics Engineering"
      ],
      
      certifications: [
        "Google Associate Cloud Engineer Certification",
        "Tableau Desktop Specialist Certification", 
        "Hootsuite Platform Certification"
      ],
      
      projects: [
        {
          name: "COVID-19 Prediction using CT Scans",
          description: "A project that used machine learning models to predict COVID-19 diagnoses using CT Scan image data, completed as part of MS in Computer Science degree at Georgia Tech.",
          link: "https://www.youtube.com/watch?v=ulFMJaeAsiw"
        },
        {
          name: "Very Clear Cut",
          description: "A media platform that hosts monthly talkshows on Facebook Live with invited guests, on topics pertinent to the human condition - from environmental sustainability and career advancement, to mental health and education.",
          link: "https://linktr.ee/veryclearcut"
        },
        {
          name: "Transform911",
          description: "Working with the University of Chicago Health Lab to examine America's 911 system through virtual roundtables and working groups.",
          link: "https://www.transform911.org"
        }
      ],
      
      publications: [
        {
          title: "Characterizing Multisystem High Users of the Homeless Services, Jail, and Hospital Systems in Chicago, IL",
          authors: "Soo, J., Hoay, L., MacCormack-Gelles, B., Edelstein, S., Metz, E., Neusteter, R., Meltzer, D., & Pollack, H.",
          year: "2022",
          journal: "Journal of Health Care for the Poor and Underserved"
        }
      ],
      
      interests: [
        "Causal inference", "Machine learning", "Text analysis", "Aviation (Part 107 Commercial Drone Operator and Private Pilot)",
        "Writing (newsletter: Strictly Interdisciplinary)", "Science communication", "Hot chocolate ranking in Hyde Park"
      ],
      
      personalProjects: [
        {
          name: "Strictly Interdisciplinary",
          description: "Personal arts and science newsletter",
          link: "https://interdisciplinary.substack.com/"
        },
        {
          name: "Very Clear Cut Podcast",
          description: "Co-hosted a youth talkshow and podcast on science and society",
          link: "https://anchor.fm/very-clear-cut"
        }
      ]
    };
    
    this.systemPrompt = `You are an AI assistant representing Leoson Hoay on his personal website. You should answer questions about his background, experience, education, projects, and interests based on the information provided. 

Key information about Leoson:
- Current role: Data Science & AI Consultant at Diffusion Venture Studio
- Education: MS Computer Science (Georgia Tech), MA Computational Social Science (University of Chicago), BSocSci (NUS)
- Expertise: Data Science, Machine Learning, Causal Inference, Computer Vision, NLP, Public Health Analytics
- Location: Currently in Singapore, with experience in US and Australia
- Interests: Bridging computer science, social sciences, and humanities to solve human problems

Please be conversational, informative, and represent Leoson professionally. If asked about something not in his background, politely redirect to what you know about his experience and interests. Keep responses concise but informative.`;
    
    this.init();
  }
  
  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.addWelcomeMessage();
  }
  
  loadSettings() {
    // API provider can be saved in localStorage (less sensitive)
    const savedProvider = localStorage.getItem('chatbot-api-provider');
    // API key is saved in sessionStorage for better security (clears when tab closes)
    const savedKey = sessionStorage.getItem('chatbot-api-key');
    
    if (savedProvider) {
      document.getElementById('api-provider').value = savedProvider;
      this.apiProvider = savedProvider;
      this.showApiKeyInput();
    }
    
    if (savedKey) {
      this.apiKey = savedKey;
    }
  }
  
  setupEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const providerSelect = document.getElementById('api-provider');
    const saveButton = document.getElementById('save-api-key');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsHeader = document.getElementById('settings-header');
    
    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    providerSelect.addEventListener('change', (e) => {
      this.apiProvider = e.target.value;
      if (e.target.value) {
        this.showApiKeyInput();
      } else {
        this.hideApiKeyInput();
      }
    });
    
    saveButton.addEventListener('click', () => this.saveApiKey());
    
    // Settings toggle functionality - handle clicks on entire header area
    settingsHeader.addEventListener('click', (e) => {
      this.toggleSettings();
    });
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    const container = document.getElementById('chatbot-container');
    container.classList.toggle('chatbot-open', this.isOpen);
    container.classList.toggle('chatbot-closed', !this.isOpen);
  }
  
  closeChat() {
    this.isOpen = false;
    const container = document.getElementById('chatbot-container');
    container.classList.remove('chatbot-open');
    container.classList.add('chatbot-closed');
  }
  
  showApiKeyInput() {
    document.getElementById('api-key').style.display = 'block';
    document.getElementById('save-api-key').style.display = 'block';
  }
  
  hideApiKeyInput() {
    document.getElementById('api-key').style.display = 'none';
    document.getElementById('save-api-key').style.display = 'none';
  }
  
  toggleSettings() {
    const settingsElement = document.getElementById('chatbot-settings');
    settingsElement.classList.toggle('collapsed');
  }
  
  collapseSettings() {
    const settingsElement = document.getElementById('chatbot-settings');
    settingsElement.classList.add('collapsed');
  }
  
  saveApiKey() {
    const apiKey = document.getElementById('api-key').value.trim();
    if (apiKey && this.apiProvider) {
      this.apiKey = apiKey;
      // Save provider in localStorage (persists across sessions)
      localStorage.setItem('chatbot-api-provider', this.apiProvider);
      // Save API key in sessionStorage (clears when tab closes for security)
      sessionStorage.setItem('chatbot-api-key', apiKey);
      this.addBotMessage("API key saved for this session! You can now start chatting with me about Leoson's background.\n\n*Note: For security, you'll need to re-enter your API key when you open a new browser tab.*");
      document.getElementById('api-key').value = '';
      
      // Auto-collapse settings to free up space
      setTimeout(() => {
        this.collapseSettings();
      }, 1500); // Delay to let user see the confirmation message
    }
  }
  
  addWelcomeMessage() {
    this.addBotMessage("Hi! I'm **Leoson's AI assistant**. I can answer questions about his:\n\n• Background and experience\n• Education and skills\n• Projects and publications\n• Interests and expertise\n\nTo get started, please select an API provider and enter your API key in the settings below.");
  }
  
  addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    
    // Parse markdown and render as HTML
    if (typeof marked !== 'undefined') {
      // Configure marked for safe HTML rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });
      messageDiv.innerHTML = marked.parse(message);
    } else {
      // Fallback to plain text if marked isn't loaded
      messageDiv.textContent = message;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  addLoadingMessage() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot loading';
    messageDiv.textContent = 'Thinking...';
    messageDiv.id = 'loading-message';
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
  }
  
  removeLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
  
  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    if (!this.apiKey || !this.apiProvider) {
      this.addBotMessage("Please configure your API provider and key in the settings first.");
      return;
    }
    
    input.value = '';
    const sendButton = document.getElementById('chatbot-send');
    sendButton.disabled = true;
    
    this.addUserMessage(message);
    const loadingMessage = this.addLoadingMessage();
    
    try {
      const response = await this.callAPI(message);
      this.removeLoadingMessage();
      this.addBotMessage(response);
    } catch (error) {
      this.removeLoadingMessage();
      this.addBotMessage("Sorry, I encountered an error. Please check your API key and try again.");
      console.error('API call failed:', error);
    } finally {
      sendButton.disabled = false;
    }
  }
  
  async callAPI(message) {
    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: message
    });
    
    // Keep conversation history manageable (last 10 messages)
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
    
    if (this.apiProvider === 'openai') {
      return await this.callOpenAI(message);
    } else if (this.apiProvider === 'claude') {
      return await this.callClaude(message);
    }
  }
  
  async callOpenAI(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.systemPrompt + '\n\nKnowledge base:\n' + JSON.stringify(this.knowledgeBase, null, 2)
          },
          ...this.conversationHistory
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // Add assistant response to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });
    
    return assistantMessage;
  }
  
  async callClaude(message) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        system: this.systemPrompt + '\n\nKnowledge base:\n' + JSON.stringify(this.knowledgeBase, null, 2),
        messages: this.conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      })
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    const data = await response.json();
    const assistantMessage = data.content[0].text;
    
    // Add assistant response to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });
    
    return assistantMessage;
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LeosonChatbot();
});