export default class Resolvers<T, Q, M> {
    static instance: Resolvers<any, any, any>;
    resolver: any = {};
    append = (obj: T | any) => {
        this.resolver = {...this.resolver, ...obj}
    };
    appendRaw = (obj: any) => {
        this.resolver = {...this.resolver, ...obj}
    };
    appendQuery = (obj: Q) => {
        if (!this.resolver.Query) {
            this.resolver.Query = {};
        }
        this.resolver.Query = {...this.resolver.Query, ...obj}
    };
    appendMutation = (obj: M) => {
        if (!this.resolver.Mutation) {
            this.resolver.Mutation = {};
        }
        this.resolver.Mutation = {...this.resolver.Mutation, ...obj}
    };

    get query(): Q {
        return this.resolver.Query
    }

    get self(): T {
        return this.resolver
    }

    get mutation(): M {
        return this.resolver.Mutation
    }

}
export let setResolvers = (resolver: any) => Resolvers.instance = resolver;
export let loadResolvers = () => {
    return Resolvers.instance.resolver;
};