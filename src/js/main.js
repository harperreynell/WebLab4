import { toolService } from '../api/ToolService.js';
import { ToolListView } from './ToolListView.js';

function initContactForm() {
    const form = document.getElementById('feedback-form-mock'); 
    if (!form) return;

    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!emailInput || !messageInput || !submitButton) return;

    const validate = () => {
        const emailValid = emailInput.value.length > 5;
        const messageValid = messageInput.value.length >= 10 && messageInput.value.length <= 500;
        
        emailInput.setCustomValidity(emailValid ? '' : 'Please enter a valid email.');
        messageInput.setCustomValidity(messageValid ? '' : 'Message must be between 10 and 500 characters.');

        return form.checkValidity();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        const data = {
            email: emailInput.value,
            message: messageInput.value
        };

        localStorage.setItem('feedbackSubmission', JSON.stringify(data));
        console.log('Form data saved to localStorage.');

        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            console.log('Form data submitted to API (mocked).');
            alert('Thank you! Your feedback has been submitted.');
            form.reset();
            localStorage.removeItem('feedbackSubmission');
        } catch (error) {
            alert('Submission failed. Check console for details.');
        } finally {
            submitButton.textContent = 'Feedback contact';
            submitButton.disabled = false;
        }
    };
    
    const savedData = localStorage.getItem('feedbackSubmission');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        emailInput.value = parsed.email || '';
        messageInput.value = parsed.message || '';
        console.log('Restored form data from localStorage.');
    }

    form.addEventListener('submit', handleSubmit);
}

document.addEventListener('DOMContentLoaded', async () => {
    await toolService.initializeDataIfEmpty();

    if (document.body.classList.contains('l-tools-page')) {
        const toolList = new ToolListView('tools-grid-container', 'sidebar-filters', 'pagination-container');
        toolList.init();
    }
    
    if (document.body.classList.contains('c-about-page')) {
         initContactForm();
    }
});