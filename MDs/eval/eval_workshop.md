# Lumina Platform - Chatbot Developer Evaluation Form


**Purpose:** To gather structured feedback from chatbot developers who deploy their chatbots on the Lumina platform.


**Target Audience:** Third-party chatbot developers evaluating Lumina for hosting their educational chatbots.


**Instructions:** Please rate each item on a scale of 1-10 (1 = Very Poor, 10 = Excellent). Provide additional comments where indicated.


---


## Section 1: Developer Portal - User Interface & Experience


### 1.1 Visual Design & Layout


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Overall visual appearance of the developer portal | | |
| Clarity and organization of the dashboard | | |
| Consistency of design elements across pages | | |
| Color scheme and readability | | |
| Mobile responsiveness of the web portal | | |


### 1.2 Navigation & Usability


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Ease of finding the "Create Plugin" feature | | |
| Intuitiveness of the sidebar navigation | | |
| Clarity of breadcrumbs and current location indicators | | |
| Ease of switching between plugin management and profile sections | | |
| Time taken to learn the portal (learning curve) | | |


### 1.3 Portal Features


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Plugin list view (filtering, searching, sorting) | | |
| Plugin details view (information display) | | |
| Plugin edit functionality | | |
| Activate/Deactivate toggle usability | | |
| Delete confirmation flow | | |


**Additional Comments on Developer Portal UI/UX:**
```
[Your feedback here]
```


---


## Section 2: Plugin Creation Workflow


### 2.1 Multi-Step Wizard Experience


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Clarity of the 5-step creation process | | |
| Step 1: Instructions - comprehensiveness and clarity | | |
| Progress indicator visibility and accuracy | | |
| Ability to navigate back to previous steps | | |
| Data persistence when navigating between steps | | |


### 2.2 Plugin Details Form (Step 2)


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Clarity of required vs optional fields | | |
| Name field - character limits and validation | | |
| Category dropdown - relevance of options (Modules, Career, School, General) | | |
| Description field - adequate space and formatting | | |
| Image upload - format support and size limits | | |
| Form validation and error messages | | |


### 2.3 Endpoint Configuration Form (Step 3)


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Server URL field - validation and format guidance | | |
| Path field - clear instructions on expected format | | |
| Request Format selection - clarity of options (JSON/text) | | |
| Request Body Query Key - explanation and examples | | |
| Authentication Type options (None, API Key, Bearer Token) | | |
| API Key/Token field - secure input handling | | |
| Overall ease of mapping your API to Lumina requirements | | |


### 2.4 Endpoint Testing (Step 4)


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Test functionality responsiveness | | |
| Clarity of test request being sent | | |
| Quality of response display | | |
| Error message helpfulness when test fails | | |
| Debugging information provided | | |
| Ability to modify and re-test | | |


### 2.5 Review & Submit (Step 5)


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Completeness of information summary | | |
| Generated OpenAPI schema - readability | | |
| Confirmation of submission success | | |
| Time from submission to plugin availability | | |


**Additional Comments on Plugin Creation Workflow:**
```
[Your feedback here]
```


---


## Section 3: API & Integration System


### 3.1 API Contract Clarity


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Documentation of expected request format | | |
| Documentation of expected response format | | |
| Clarity on JSON vs plain text requirements | | |
| Understanding of query key configuration | | |
| Authentication header documentation (X-API-Key, Bearer) | | |


### 3.2 OpenAPI Schema Generation


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Automatic schema generation quality | | |
| Schema accuracy reflecting your configuration | | |
| Ability to view/export the generated schema | | |
| Compatibility with standard OpenAPI 3.0.0 spec | | |


### 3.3 Integration Flexibility


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Support for custom endpoint paths (not just /getResponse) | | |
| Support for different authentication methods | | |
| Request body customization options | | |
| Response format handling flexibility | | |
| Ability to integrate with your existing chatbot API | | |
| CORS and cross-origin request handling | | |


**Additional Comments on API & Integration:**
```
[Your feedback here]
```


---


## Section 4: Developer Documentation & Support


### 4.1 Documentation Quality


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Availability of getting started guide | | |
| API contract documentation completeness | | |
| Troubleshooting guide helpfulness | | |
| Code examples and sample implementations | | |
| FAQ coverage of common issues | | |
| Documentation currency (up-to-date information) | | |


### 4.2 Onboarding Experience


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Time to deploy first plugin (from scratch) | | |
| Clarity of prerequisites | | |
| Step-by-step deployment instructions | | |
| In-portal contextual help/tooltips | | |
| Availability of video tutorials or walkthroughs | | |


### 4.3 Error Handling & Debugging


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Error messages - clarity and actionability | | |
| "Operation not found" error - guidance provided | | |
| "Schema validation" errors - debugging info | | |
| Network/timeout errors - troubleshooting steps | | |
| Authentication errors - resolution guidance | | |
| Backend logging accessibility | | |


**Additional Comments on Documentation & Support:**
```
[Your feedback here]
```


---


## Section 5: Platform Capabilities & Features


### 5.1 Core Platform Features


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Plugin activation/deactivation functionality | | |
| Real-time sync to mobile app (1-2 minute sync) | | |
| Plugin versioning and update process | | |
| Plugin image/branding customization | | |
| Category classification system | | |
| Plugin description and metadata management | | |


### 5.2 Student-Facing Features (Mobile App)


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| How your chatbot appears in the mobile app | | |
| Chatbot discovery by students (browse, search) | | |
| Favorites functionality for student engagement | | |
| Conversation history preservation | | |
| Chat interface quality when using your plugin | | |
| Response time from student message to chatbot reply | | |


### 5.3 Data Synchronization


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Web to Mobile database sync reliability | | |
| Sync speed (time for changes to appear on mobile) | | |
| Plugin update propagation accuracy | | |
| Handling of concurrent updates | | |


### 5.4 Current Limitations Assessment


Please rate how significantly these current limitations affect your use case:
(1 = Not an issue, 10 = Critical blocker)


| Known Limitation | Impact (1-10) | Workaround Used |
|------------------|---------------|-----------------|
| No analytics dashboard for plugin usage | | |
| No user context passed to plugins (who is chatting) | | |
| Limited conversation history context sent to plugin | | |
| No webhook system for real-time events | | |
| No programmatic Developer REST API | | |
| No multi-language/internationalization support | | |
| No voice input/output support | | |
| No image generation plugin support | | |


**Additional Comments on Platform Capabilities:**
```
[Your feedback here]
```


---


## Section 6: Performance & Reliability


### 6.1 Portal Performance


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Developer portal page load times | | |
| Plugin creation form responsiveness | | |
| Image upload speed and reliability | | |
| Search and filter performance | | |
| Overall portal stability | | |


### 6.2 Backend/API Performance


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Your chatbot endpoint call latency via Lumina | | |
| Request timeout handling (60-second limit) | | |
| Error recovery and retry mechanisms | | |
| Concurrent request handling | | |


### 6.3 Reliability & Uptime


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Portal availability (uptime experience) | | |
| Mobile backend stability | | |
| Sync function reliability | | |
| Data persistence and integrity | | |
| Graceful degradation during issues | | |


**Additional Comments on Performance & Reliability:**
```
[Your feedback here]
```


---


## Section 7: Security & Authentication


### 7.1 Developer Authentication


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Azure AD / Microsoft SSO experience | | |
| NTU email validation process | | |
| Session management and timeout behavior | | |
| Sign-out process clarity | | |


### 7.2 Plugin Security


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| API key secure storage (not exposed in UI) | | |
| Authentication header transmission security | | |
| Plugin isolation (your plugin vs others) | | |
| Confidence in data protection | | |


### 7.3 Student Data Handling


| Criteria | Rating (1-10) | Comments |
|----------|---------------|----------|
| Clarity on what student data your plugin receives | | |
| Conversation data privacy handling | | |
| User identifier anonymization/hashing | | |
| Compliance with data protection requirements | | |


**Additional Comments on Security:**
```
[Your feedback here]
```


---


## Section 8: Overall Developer Experience


### 8.1 Summary Ratings


| Criteria | Rating (1-10) |
|----------|---------------|
| **Overall ease of deploying a chatbot to Lumina** | |
| **Overall quality of the developer portal** | |
| **Overall satisfaction with the plugin system** | |
| **Likelihood to recommend Lumina to other developers** | |
| **Likelihood to deploy additional chatbots on Lumina** | |


### 8.2 Comparative Assessment


| Question | Your Response |
|----------|---------------|
| How does Lumina compare to other chatbot hosting platforms you've used? | |
| What unique value does Lumina provide for educational chatbots? | |
| What is the biggest advantage of using Lumina? | |
| What is the biggest disadvantage or limitation? | |


### 8.3 Open-Ended Feedback


**What features would you most like to see added to Lumina?**
```
[Your feedback here]
```


**What was the most frustrating part of deploying your chatbot?**
```
[Your feedback here]
```


**What worked particularly well in your experience?**
```
[Your feedback here]
```


**Any additional comments, suggestions, or concerns?**
```
[Your feedback here]
```


---


## Section 9: Technical Environment Details


Please provide the following information to help contextualize your feedback:


| Item | Your Response |
|------|---------------|
| Your chatbot's primary purpose | |
| Your chatbot's technology stack (e.g., Python Flask, Node.js, Azure Functions) | |
| Authentication method used (None, API Key, Bearer Token) | |
| Request format used (JSON, Plain Text) | |
| Approximate response time of your chatbot API (ms) | |
| Number of plugins you've deployed on Lumina | |
| Duration of experience with Lumina (days/weeks/months) | |
| Your development experience level (Junior/Mid/Senior) | |


---


## Evaluation Summary


**Date of Evaluation:** _______________


**Evaluator Name (Optional):** _______________


**Evaluator Email:** _______________


**Plugin Name(s) Evaluated:** _______________


---


**Thank you for your valuable feedback!**


Your responses will help improve the Lumina platform for all chatbot developers.


# Lumina Platform - Workshop Evaluation Form


**Purpose:** To gauge interest and gather feedback from potential chatbot developers attending an introductory workshop about the Lumina platform.


**Target Audience:** Workshop attendees who are interested in becoming chatbot developers but may not have hands-on experience yet.


**Instructions:** Please answer the following questions honestly. Your feedback will help us improve both the workshop and the Lumina platform.


---


## Section 1: About You


### 1.1 Background Information


| Question | Your Response |
|----------|---------------|
| Your current role (e.g., Student, Researcher, Faculty, Staff) | |
| Your department/school at NTU | |
| Your year of study (if student) | |


### 1.2 Technical Experience


**How would you rate your programming experience?**
- [ ] Beginner (learning to code)
- [ ] Intermediate (comfortable with 1-2 languages)
- [ ] Advanced (proficient in multiple languages)
- [ ] Expert (professional developer)


**Which programming languages/technologies are you familiar with?** (Check all that apply)
- [ ] Python
- [ ] JavaScript/TypeScript
- [ ] Java
- [ ] C/C++
- [ ] HTML/CSS
- [ ] React/Vue/Angular
- [ ] Node.js
- [ ] Flask/Django
- [ ] Other: _______________


**Have you worked with APIs before?**
- [ ] No, never
- [ ] I've heard of them but haven't used them
- [ ] I've consumed APIs (made API calls)
- [ ] I've built APIs (created endpoints)


### 1.3 AI/Chatbot Experience


**Have you used AI chatbots before (e.g., ChatGPT, Copilot)?**
- [ ] Never
- [ ] Occasionally (a few times)
- [ ] Regularly (weekly or more)
- [ ] Daily


**Have you ever built or trained a chatbot?**
- [ ] No, never
- [ ] I've attempted but didn't complete
- [ ] Yes, a simple rule-based bot
- [ ] Yes, using AI/ML frameworks
- [ ] Yes, using Large Language Models (LLMs)


---


## Section 2: Workshop Feedback


### 2.1 Workshop Content


Please rate the following aspects of today's workshop (1 = Very Poor, 5 = Excellent):


| Aspect | Rating (1-5) | Comments |
|--------|--------------|----------|
| Clarity of the presentation | | |
| Pace of the workshop (too slow/just right/too fast) | | |
| Relevance of content to your interests | | |
| Quality of demonstrations | | |
| Opportunity to ask questions | | |
| Handout/documentation materials provided | | |


### 2.2 Workshop Duration


**How did you find the length of the workshop?**
- [ ] Too short - would have liked more time
- [ ] Just right
- [ ] Too long
- [ ] No opinion


### 2.3 Understanding Gained


**After attending this workshop, how well do you understand:**


| Topic | Understanding (1-5) |
|-------|---------------------|
| What Lumina is and its purpose | |
| How students use the Lumina mobile app | |
| How developers deploy chatbots on Lumina | |
| The technical requirements for your chatbot API | |
| The plugin creation process | |
| The potential benefits of hosting on Lumina | |


---


## Section 3: Interest in Lumina


### 3.1 Platform Appeal


Please rate your agreement with the following statements (1 = Strongly Disagree, 5 = Strongly Agree):


| Statement | Rating (1-5) |
|-----------|--------------|
| Lumina addresses a real need in the NTU academic environment | |
| I can see how my chatbot ideas could help students | |
| The plugin-based architecture seems flexible and useful | |
| Having a centralized platform for educational chatbots is valuable | |
| I trust that Lumina would handle my chatbot responsibly | |
| The mobile app seems like a good way to reach students | |


### 3.2 Perceived Benefits


**What do you see as the main benefits of using Lumina?** (Check all that apply)
- [ ] Ready-made mobile app interface (no need to build my own)
- [ ] Access to a large student user base
- [ ] User authentication handled by the platform
- [ ] Conversation management and history
- [ ] Centralized deployment and management
- [ ] Integration with NTU ecosystem
- [ ] Other: _______________


### 3.3 Potential Concerns


**What concerns, if any, do you have about using Lumina?** (Check all that apply)
- [ ] Technical complexity of integration
- [ ] Limited customization options
- [ ] Data privacy and security
- [ ] Platform reliability/uptime
- [ ] Lack of control over user experience
- [ ] Time investment required
- [ ] Unclear documentation
- [ ] Other: _______________


---


## Section 4: Development Interest


### 4.1 Chatbot Ideas


**Do you have ideas for chatbots that could help NTU students?**
- [ ] Yes, I have several ideas
- [ ] Yes, I have one main idea
- [ ] Maybe, I need to think about it
- [ ] No, not at the moment


**If yes, briefly describe your chatbot idea(s):**
```
[Your ideas here]
```


### 4.2 Target Use Cases


**Which categories of chatbots interest you most?** (Rank 1-4, with 1 being most interested)
| Category | Rank (1-4) | Example Ideas |
|----------|------------|---------------|
| Modules/Courses | | Course helper, assignment assistant |
| Career/Planning | | Career advisor, internship finder |
| Campus/School | | Navigation, events, facilities |
| General/Other | | Study tips, wellness, social |


### 4.3 Willingness to Develop


**How likely are you to develop a chatbot for Lumina?**
- [ ] Very likely - I plan to start soon
- [ ] Likely - I'm interested and may try it
- [ ] Possibly - I need more information/time
- [ ] Unlikely - Not a priority right now
- [ ] Very unlikely - Not interested


**What would increase your likelihood to develop a chatbot for Lumina?** (Check all that apply)
- [ ] More detailed technical documentation
- [ ] Video tutorials and walkthroughs
- [ ] Sample code and templates
- [ ] One-on-one support sessions
- [ ] Hands-on workshop with guided development
- [ ] Incentives or recognition
- [ ] Collaboration with other developers
- [ ] Other: _______________


---


## Section 5: Expectations & Requirements


### 5.1 Feature Expectations


**What features would you expect from a chatbot hosting platform like Lumina?**


Please rate how important each feature is to you (1 = Not Important, 5 = Essential):


| Feature | Importance (1-5) |
|---------|------------------|
| Easy deployment process (minimal technical setup) | |
| Detailed usage analytics for my chatbot | |
| Customizable chatbot appearance/branding | |
| Support for multiple languages | |
| Real-time monitoring and alerts | |
| Version control for chatbot updates | |
| Testing environment before going live | |
| Integration with LLM providers (OpenAI, Azure, etc.) | |
| Student feedback/rating system | |
| Conversation logs and history access | |


### 5.2 Support Expectations


**What type of support would you need to successfully deploy a chatbot?**


| Support Type | Importance (1-5) |
|--------------|------------------|
| Comprehensive written documentation | |
| Step-by-step video tutorials | |
| Example chatbot implementations | |
| Community forum or Discord | |
| Direct email support | |
| Office hours with the Lumina team | |
| FAQ and troubleshooting guides | |


### 5.3 Time Investment


**How much time could you realistically dedicate to developing a chatbot for Lumina?**
- [ ] Less than 5 hours total
- [ ] 5-10 hours
- [ ] 10-20 hours
- [ ] 20-40 hours
- [ ] More than 40 hours
- [ ] Not sure


**When would you ideally want to start working on a chatbot?**
- [ ] Immediately
- [ ] Within the next month
- [ ] Next semester
- [ ] During vacation/break
- [ ] No specific timeline
- [ ] Not planning to


---


## Section 6: Mobile App Preview Feedback


*If you were shown a demo of the Lumina mobile app during the workshop:*


### 6.1 Mobile App Impressions


Please rate your impressions of the mobile app (1 = Very Poor, 5 = Excellent):


| Aspect | Rating (1-5) | Comments |
|--------|--------------|----------|
| Overall look and feel | | |
| Ease of finding chatbots | | |
| Chat interface design | | |
| Navigation between features | | |
| Appeal to students like yourself | | |


### 6.2 Student Perspective


**As a potential student user, would you use the Lumina mobile app?**
- [ ] Definitely yes
- [ ] Probably yes
- [ ] Maybe
- [ ] Probably not
- [ ] Definitely not


**What types of chatbots would you want to see in the app as a student?**
```
[Your suggestions here]
```


---


## Section 7: Open Feedback


### 7.1 What Excited You Most


**What aspect of Lumina excited you the most during this workshop?**
```
[Your response here]
```


### 7.2 Questions Remaining


**What questions do you still have about Lumina that weren't answered in the workshop?**
```
[Your questions here]
```


### 7.3 Suggestions for Improvement


**How could this workshop be improved for future attendees?**
```
[Your suggestions here]
```


### 7.4 Additional Comments


**Any other thoughts, ideas, or feedback you'd like to share?**
```
[Your comments here]
```


---


## Section 8: Follow-Up Interest


### 8.1 Stay Connected


**Would you like to receive updates about Lumina?**
- [ ] Yes, please add me to the mailing list
- [ ] No, thank you


**Would you be interested in attending future Lumina events?**
- [ ] Advanced development workshop
- [ ] Chatbot hackathon
- [ ] Developer community meetups
- [ ] LLM/AI training sessions
- [ ] None of the above


### 8.2 Contact Information (Optional)


*Provide your contact details if you'd like to be notified about future opportunities:*


| Field | Your Response |
|-------|---------------|
| Name | |
| NTU Email | |
| Preferred contact method (Email/Teams) | |


### 8.3 Mentorship Interest


**Would you be interested in being paired with an experienced developer to help build your first chatbot?**
- [ ] Yes, I would love a mentor
- [ ] Maybe, depending on time commitment
- [ ] No, I prefer to learn independently


---


## Summary


### Overall Workshop Rating


**Overall, how would you rate this workshop?**


| ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
|---|---|---|---|---|
| Poor | Below Average | Average | Good | Excellent |
| [ ] | [ ] | [ ] | [ ] | [ ] |


### Net Promoter Score


**How likely are you to recommend this workshop to a friend or colleague?**


| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Not at all likely | | | | | Neutral | | | | | Extremely likely |
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |


---


**Workshop Date:** _______________


**Workshop Location/Format:** _______________


---


**Thank you for attending and for your valuable feedback!**


Your input will help shape the future of Lumina and educational AI chatbots at NTU.












