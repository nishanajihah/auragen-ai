## AuraGen AI

### AI-Powered Design System Generator

AuraGen AI is an innovative platform designed to revolutionize how designers and developers approach the creation of design systems. Leveraging cutting-edge AI, it aims to break through creative blocks and streamline the entire process from concept to code, allowing teams to focus on core product development.

---

## ✨ What it Does

Imagine transforming design concepts into fully functional design systems in moments. AuraGen AI is your **intelligent co-pilot**, eliminating "design block" and the tedious hours of manual UI coding. Simply describe your vision, and our AI instantly generates a comprehensive, production-ready design system, complete with component libraries and even voice-guided explanations. It's the ultimate leap from idea to implementation, freeing you to focus on the core innovation of your application.

**Key Features:**

* **Instant AI Generations:** Rapidly create design systems using advanced AI.
* **Voice-Guided Explanations:** Understand design elements with clear, concise voice AI (powered by ElevenLabs).
* **Production-Ready Output:** Generate basic to full component libraries (React, Vue, etc.).
* **Flexible Tiers:** From free exploration to advanced enterprise solutions.

---

## 🛠️ The Tech Behind the Magic (How I Built It)

AuraGen AI is engineered with a modern, high-performance stack, chosen for speed, scalability, and developer experience:

* **Frontend Acceleration:** Built on **Bolt.new**, our development experience was incredibly accelerated, allowing for rapid prototyping and seamless frontend scaffolding.
* **Robust Backend:** A powerful **Supabase** backend provides scalable database management, secure authentication, and lightning-fast serverless Edge Functions.
* **Intelligent Core:** **Google Gemini** (Flash & Pro models) powers the core AI generation, interpreting complex prompts to create sophisticated design systems.
* **Vocal Clarity:** **ElevenLabs** brings our design explanations to life with high-quality voice AI, adding an intuitive layer to understanding generated systems.
* **Seamless Monetization:** **Stripe** and **RevenueCat** work in harmony to provide a smooth and secure subscription management and payment processing experience.
* **Global Deployment:** **Netlify** ensures our frontend is deployed with lightning speed and reliability across the globe.
* **Efficient Styling:** **Tailwind CSS** enables rapid, utility-first styling, ensuring a clean and responsive user interface.

---

## 🚀 My Journey & Key Learnings

Building AuraGen AI in just one week was an intense, yet incredibly rewarding sprint. My personal inspiration stemmed from years of battling "design block" and the frustration of incomplete projects due to complex integrations. This project became a direct challenge to overcome those very hurdles.

The biggest triumph was successfully **connecting a multitude of disparate services**—Supabase, RevenueCat, Stripe, Gemini, ElevenLabs, and Netlify—many for the first time in a complete, end-to-end application. This journey taught me invaluable lessons:

* Mastering the intricate flow of **Stripe and RevenueCat** for robust subscription management.
* Deepening my understanding of **webhooks** for secure, real-time backend updates.
* Gaining hands-on expertise in **Supabase** database management and Edge Functions.
* Practical application of **Gemini and ElevenLabs APIs** to deliver core AI functionality.

While Bolt.new significantly streamlined the development, I also discovered areas for improvement:
* **AI Prompt Control:** More explicit confirmation steps or clearer boundaries for prompt processing would help manage token consumption.
* **Database Management:** Greater control and clear confirmation prompts before critical database changes (e.g., migrations) would enhance trust and prevent unintended alterations.

Despite these challenges, completing this complex, integrated project is an accomplishment I'm immensely proud of, marking a significant personal breakthrough in my development journey.

---

## 🌌 What's Next for AuraGen AI

AuraGen AI is poised to **redefine the very landscape of digital creation**. While currently excelling at web and app design systems, our audacious vision is to evolve into a **universal AI architect**. Imagine generating not just interfaces, but entire strategic blueprints: from intricate business process diagrams to complex architectural plans, all from natural language prompts. We're pushing the boundaries of AI to deliver unparalleled accuracy and comprehensive coverage, empowering every creator to rapidly conceptualize, plan, and build any system imaginable, with a level of insight and speed previously unattainable. **The future of design and planning is intelligent, intuitive, and limitless.**

---

## ⚙️ Setup and Deployment

To get AuraGen AI running:

1.  **Clone the Repository:**

    ```bash
    git clone [Your_Repo_URL_Here]
    cd AuraGen-AI
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Supabase Setup:**

    * Create a new project in your [Supabase Dashboard](https://app.supabase.com/).
    * Run the provided SQL schema script in your Supabase SQL Editor to set up tables (`users`, `projects`, `usage_tracking`), triggers, and Row Level Security (RLS) policies. *(Refer to the `supabase/migrations` folder or the provided SQL in chat history for the full script).*
    * Deploy your [Supabase Edge Functions](https://supabase.com/docs/guides/functions/deploy) for AI generation, text-to-speech, and webhook handling. Ensure sensitive API keys (ElevenLabs, RevenueCat Webhook Secret, Supabase Service Role Key) are configured as Supabase secrets.

4.  **Netlify Deployment:**

    * Connect your repository to [Netlify](https://app.netlify.com/).
    * **Build Command:** `npm run build`
    * **Publish Directory:** `build`
    * **Base Directory:** `.`
    * **Functions Directory:** (Leave blank, as Supabase handles your functions)
    * **Environment Variables (for Frontend):** Add the following in Netlify settings:
        * `REACT_APP_SUPABASE_URL`
        * `REACT_APP_SUPABASE_ANON_KEY`
        * `REACT_APP_REVENUECAT_PUBLIC_API_KEY`
    * Add a `_redirects` file in your `public` directory for SPA routing:

        ```
        /* /index.html 200
        ```

5.  **Run Locally (for development):**

    ```bash
    npm start
    ```
    (Or `npm run dev` if using Vite)

---

## 🤝 Contributing

We welcome contributions! If you have ideas for improvements, bug fixes, or new features, please feel free to open an issue or submit a pull request.

## 📄 License

[Specify your project's license here, e.g., MIT, Apache 2.0, etc.]

---

## 📺 See AuraGen AI in Action

Witness the magic of AuraGen AI firsthand!

[AURAGEN AI](auragen-ai.netlify.app)
