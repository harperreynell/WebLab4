import { toolService } from '../api/ToolService.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof hljs === 'undefined') {
        console.error("Highlight.js is not loaded. Code highlighting will not work.");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const toolId = urlParams.get('id');

    const mainTitle = document.querySelector('.c-tool-details__title');
    const pageTitle = document.querySelector('title');
    const toolNameEl = document.querySelector('.tool-name');
    const toolUsageEl = document.querySelector('.tool-usage');
    const toolDetailsEl = document.querySelector('.tool-details-text');
    const toolGithubLink = document.querySelector('.tool-github-link a');
    const codeContentEl = document.querySelector('.code-content');

    if (mainTitle) mainTitle.textContent = "Loading tool details...";
    if (pageTitle) pageTitle.textContent = 'Dev Tools Showcase - Loading...';
    if (codeContentEl) codeContentEl.textContent = 'Loading code snippet...';


    if (!toolId) {
        if (mainTitle) mainTitle.textContent = "Error: Tool ID is missing.";
        return;
    }

    try {
        const tool = await toolService.fetchToolById(toolId);

        if (tool) {
            const formattedTitle = `Tool details: ${tool.name}`;

            if (pageTitle) pageTitle.textContent = formattedTitle;
            if (mainTitle) mainTitle.textContent = formattedTitle;
            
            if (toolNameEl) toolNameEl.textContent = tool.name;
            if (toolUsageEl) toolUsageEl.textContent = tool.usage || 'No usage details provided.'; 
            if (toolDetailsEl) toolDetailsEl.textContent = tool.details || 'No detailed information available.';
            
            if (toolGithubLink) {
                toolGithubLink.href = tool.github || '#';
                toolGithubLink.textContent = tool.github || 'N/A';
            }
            
            if (codeContentEl) {
                const snippet = tool.snippet || '// No code available';
                codeContentEl.textContent = snippet;
                
                const language = tool.language || 'javascript'; 
                codeContentEl.classList.add(`language-${language}`);
                
                if (typeof hljs !== 'undefined') {
                    hljs.highlightElement(codeContentEl);
                }
            }

        } else {
            throw new Error('Tool not found');
        }

    } catch (error) {
        console.error("Error fetching tool details:", error);
        
        if (pageTitle) pageTitle.textContent = 'Dev Tools Showcase - Tool Not Found';
        if (mainTitle) mainTitle.textContent = '404 Tool Not Found';
        
        if (codeContentEl) {
             codeContentEl.textContent = '// Error: Tool ID not recognized or failed to load.';
             if (typeof hljs !== 'undefined') hljs.highlightElement(codeContentEl);
        }
        
        if (toolNameEl) toolNameEl.textContent = 'N/A';
        if (toolUsageEl) toolUsageEl.textContent = 'N/A';
        if (toolDetailsEl) toolDetailsEl.textContent = 'The requested tool was not found in the database.';
        if (toolGithubLink) {
            toolGithubLink.href = '#';
            toolGithubLink.textContent = 'N/A';
        }
    }
});