import { defineStore } from 'pinia';
import axiosClient from "@/plugins/axios";

export const useExploreStore = defineStore({
    id: 'explore',

    state: () => ({
        originalProjects: {},
        activeFilters: false,
        projectFilters: {},
        projects: {},
        featuredProjects: [],
        loading: {
            filters: true,
            projects: true,
            featured: true,
            sort: true
        },
        searchTerm: "",
        searchTimeout: null,
        sortFilters: [],
        sortActiveFilter: null,
        sortDirectionInverted: false,
        disableOpacity: false,
        showEmptyProjects: true
    }),

    actions: {
        async getProject(id) {
            if (this.originalProjects.data) {
                const originalProject = this.originalProjects.data.find((project) => project.id === id);
                if (originalProject) {
                    return originalProject;
                }
            }
            const { data } = await axiosClient.get(`/api/repoinsights/explore/${id}/`)
            return data;
        },

        searchProjects(search) {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                if (search === "") {
                    this.getProjectsFromOriginal();
                    return;
                }

                const searchTerm = search.toLowerCase();
                let filteredProjects = this.originalProjects.data.filter((project) => {
                    const projectName = project.name.toLowerCase();
                    const ownerName = project.owner_name.toLowerCase();
                    return (projectName.includes(searchTerm) || ownerName.includes(searchTerm)) && this.checkHasRating(project);
                });

                filteredProjects = this.sortByFilter(filteredProjects, this.sortActiveFilter);
    
                this.projects = { ...this.projects, data: filteredProjects, total: filteredProjects.length };
            }, 300);
        },


        async loadData() {
            this.searchTerm = "";
            const params = this.getUrlParams();
            await Promise.all([
                this.getFilters(params),
                this.getProjects(params),
                this.getSortFilters(params),
            ]);
        },

        async getFeaturedProjects() {
            if ( this.featuredProjects.length > 0 ) {
                return;
            }

            this.loading.featured = true;
            const { data } = await axiosClient.get("/api/repoinsights/explore/featured/");
            this.featuredProjects = data.projects;
            this.loading.featured = false;
        },

        getUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            let params = {};
            for (const [key, value] of urlParams) {
                params[key] = value;
                // if (key !== 'sort') {
                //     params[key] = value;
                // }
            }
            if (Object.keys(params).length !== 0 && params.constructor === Object) {
                this.activeFilters = true;
            }
            else {
                this.activeFilters = false;
            }
            return params;
        },

        async getFilters(params) {
            this.loading.filters = true;
            const { data } = await axiosClient.get("/api/repoinsights/filters/", { params });
            data.langs.data.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            
            this.projectFilters = data;
            this.loading.filters = false;
        },

        async getProjects(params) {
            let response_data = null;
            this.loading.projects = true;

            if ( Object.keys(params).length === 0 && Object.keys(this.originalProjects).length > 0 ) {
                response_data = { ...this.originalProjects}
            }

            else{
                const { data } = await axiosClient.get("/api/repoinsights/explore", { params });
                response_data = data
                if ( Object.keys(this.originalProjects).length === 0 ) {
                    this.originalProjects = data;
                }

            }
            const sortedProjects = this.sortByFilter(response_data.data, params.sort);
            this.projects = { ...sortedProjects, data: sortedProjects, total: sortedProjects.length };
            this.loading.projects = false;
        },

        async updateUserProject(project) {
            await axiosClient.post("/api/user/projects/", {
                project_id: project.id,
                action: project.selected ? "add" : "remove"
            })
        },

        async getSortFilters(params) {
            this.loading.sort = true;
            const { data } = await axiosClient.get("/api/repoinsights/sort/");
            this.sortFilters = data.metrics;
            this.sortActiveFilter =
                params.sort
                    ? params.sort
                    : null
            this.loading.sort = false;
        },

        sortByFilter(projects, filter) {
            if (!filter) {
                this.removeParamFromUrl('sort');
            }
            else{
                this.addParamToUrl('sort', filter);
            }
        
            this.sortActiveFilter = filter;
        
            const extractValue = (item) => {
                if (!filter) {
                    return new Date(item.last_extraction_date)
                }
                const ratingValue = item.rating.find(rating => rating.id === filter);
                return ratingValue ? ratingValue.value : null;
            };
            
            return projects.sort((a, b) => {
                const valueA = extractValue(a);
                const valueB = extractValue(b);
                if (valueA === null && valueB === null) { return 0; }
                if (valueA === null) { return 1; }
                if (valueB === null) { return -1; }
                const order = this.sortDirectionInverted ? valueA - valueB : valueB - valueA;
                return order;
            });
        },
        

        async sortByOrder() {
            this.loading.sort = true;
            await new Promise(resolve => {
                setTimeout(() => {
                    if ( !this.sortActiveFilter ) {
                        this.projects.data.reverse();
                    }
                    else{
                        const emptyProjects = this.getEmptyProjects(this.projects.data);
                        const nonEmptyProjects = this.getNonEmptyProjects(this.projects.data);
                        nonEmptyProjects.reverse();
                        const orderedProjects = [...nonEmptyProjects, ...emptyProjects];
                        this.projects = { ...this.projects, data: orderedProjects };
                    }
                    resolve();
                }, 0);
            });
            this.loading.sort = false;

        },

        addParamToUrl(key, value) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set(key, value);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
        },

        removeParamFromUrl(key) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.delete(key);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
            if (urlParams.toString().length === 0) {
                window.history.replaceState({}, '', `${window.location.pathname}`);
            }
        },

        checkHasRating(project) {
            if ( !this.sortActiveFilter ) {
                return true;
            }
            const hasRating = project.rating.find(rating => rating.id === this.sortActiveFilter);
            return hasRating ? true : false;
        },

        getNonEmptyProjects(projects) {
            return projects.filter(project => {
                return this.checkHasRating(project);
            });
        },
        getEmptyProjects(projects) {
            return projects.filter(project => {
                return !this.checkHasRating(project);
            });
        },

        getProjectsFromOriginal() {
            const nonEmptyProjects = this.getNonEmptyProjects(this.originalProjects.data);
            const emptyProjects = this.getEmptyProjects(this.originalProjects.data);

            const orderedProjects = [...nonEmptyProjects, ...emptyProjects];
            this.projects = { ...this.projects, data: orderedProjects, total: orderedProjects.length };

            this.projects.data = this.sortByFilter(this.projects.data, this.sortActiveFilter);
        }

    }
});
