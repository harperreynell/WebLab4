import { toolService } from '../api/ToolService.js';
import { Paginator } from './Paginator.js';

export class ToolListView {
    constructor(containerId, filtersContainerId, paginatorContainerId) {
        this.container = document.getElementById(containerId);
        this.filtersContainer = document.getElementById(filtersContainerId);
        this.paginatorContainer = document.getElementById(paginatorContainerId);
        this.paginator = new Paginator(1000); 

        this.state = {
            search: '',
            sort: 'name',
            order: 'asc',
            isLoading: false,
            error: null,
        };
        
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    init() { 
        if (!this.container || !this.filtersContainer || !this.paginatorContainer) {
            console.error("ToolListView: Missing required DOM elements.");
            return;
        }
        
        this.loadStateFromURL();
        
        this.filtersContainer.querySelector('#search-by-name').addEventListener('input', this.handleSearch);
        this.filtersContainer.querySelector('.c-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.fetchData(); 
        });
        
        this.filtersContainer.querySelector('#sort-by-select').addEventListener('change', this.handleSortChange);
        this.filtersContainer.querySelector('#sort-order-select').addEventListener('change', this.handleSortChange);

        this.fetchData();
    }
    
    loadStateFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.state.search = params.get('q') || '';
        this.state.sort = params.get('_sort') || 'name';
        this.state.order = params.get('_order') || 'asc';
        
        const searchInput = this.filtersContainer.querySelector('#search-by-name');
        if (searchInput) searchInput.value = this.state.search;

        const sortSelect = this.filtersContainer.querySelector('#sort-by-select');
        if (sortSelect) sortSelect.value = this.state.sort;

        const orderSelect = this.filtersContainer.querySelector('#sort-order-select');
        if (orderSelect) orderSelect.value = this.state.order;
    }

    updateURL() {
        const params = new URLSearchParams();
        if (this.state.search) params.set('q', this.state.search);
        if (this.state.sort && this.state.order) {
            params.set('_sort', this.state.sort);
            params.set('_order', this.state.order);
        }
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.pushState(this.state, '', newUrl);
    }

    async fetchData() { 
        this.state.isLoading = true;
        this.state.error = null;
        this.renderLoading();
        
        this.updateURL();

        try {
            const apiParams = {
                q: this.state.search,
                _sort: this.state.sort,
                _order: this.state.order,
                ...this.paginator.getCurrentParams(),
            };
            
            const { tools, totalCount } = await toolService.fetchTools(apiParams);
            
            this.render(tools);

        } catch (err) {
            this.state.error = err.message || 'Failed to fetch data. Please check json-server.';
            this.renderError();
            console.error(err);
        } finally {
            this.state.isLoading = false;
            this.paginatorContainer.innerHTML = '';
        }
    }

    handleSearch(e) {
        this.state.search = e.target.value;
    }

    handleSortChange() {
        this.state.sort = this.filtersContainer.querySelector('#sort-by-select').value;
        this.state.order = this.filtersContainer.querySelector('#sort-order-select').value;
        this.fetchData();
    }
    
    renderLoading() {
        this.container.innerHTML = `
            <div class="c-loader">Loading tools...</div>
        `;
    }

    renderError() {
        this.container.innerHTML = `
            <div class="c-error">Error: ${this.state.error}</div>
        `;
    }

    render(tools) {
        if (tools.length === 0) {
            this.container.innerHTML = `
                <div class="c-empty">No tools found matching "${this.state.search}".</div>
            `;
            return;
        }

        this.container.innerHTML = tools.map(tool => this.createToolCard(tool)).join('');
    }

    createToolCard(tool) {
        const toolId = tool.id || 'unknown';
        const tagsHtml = (tool.tags || []).map(tag => `<span class="c-tag">${tag}</span>`).join('');
        
        return `
            <article class="c-card">
                <h3 class="c-card__title">${tool.name || 'Untitled Tool'}</h3>
                <div class="c-card__snippet" role="region" aria-label="Tool code fragment">
                    <pre><code class="c-card__code">${(tool.snippet || '// No code available').substring(0, 150)}...</code></pre>
                </div>
                <div class="c-card__tags">
                    ${tagsHtml}
                </div>
                <a href="tool-details.html?id=${toolId}" class="c-card__link" aria-label="View ${tool.name} details"></a>
            </article>
        `;
    }
}