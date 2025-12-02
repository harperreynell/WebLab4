export class Paginator {
    constructor(limit = 1000) {
        this.page = 1;
        this.limit = limit;
        this.totalCount = 0;
        this.totalPages = 0;
    }

    setTotalCount(totalCount) {
        this.totalCount = totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.limit); 
    }

    setPage(page) {
        this.page = 1;
    }

    nextPage() {
    }

    prevPage() {
    }

    getOffset() {
        return (this.page - 1) * this.limit;
    }

    getCurrentParams() {
        return {
            _limit: this.limit,
        };
    }
}