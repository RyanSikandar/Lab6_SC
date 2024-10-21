class SocialNetwork {
    static guessFollowsGraph(tweets) {
        const followsGraph = new Map();

        tweets.forEach(({ author, text }) => {
            const mentions = text.match(/@(\w+)/g); // Match all mentions

            if (mentions) {
                const userMentions = new Set(mentions.map(mention => mention.slice(1).toLowerCase())); // Extract mentioned users and convert to lowercase

                // If the author is not in the graph, initialize their entry
                if (!followsGraph.has(author.toLowerCase())) {
                    followsGraph.set(author.toLowerCase(), new Set());
                }

                // Add all mentioned users to the author's following set
                const authorSet = followsGraph.get(author.toLowerCase());
                userMentions.forEach(user => authorSet.add(user));
            }
        });

        return followsGraph;
    }

    static influencers(followsGraph) {
        const influencerCount = new Map();
    
        // Count followers for each user
        followsGraph.forEach((followers, user) => {
            followers.forEach(follower => {
                if (!influencerCount.has(follower)) {
                    influencerCount.set(follower, 0);
                }
                influencerCount.set(follower, influencerCount.get(follower) + 1);
            });
        });
    
        // Create a sorted list based on follower count
        const sortedInfluencers = [...influencerCount.entries()]
            .sort(([, countA], [, countB]) => countB - countA) // Sort in descending order
            .map(([user]) => user); // Return only the user names
    
        return sortedInfluencers;
    }
     static influencers(followsGraph) {
        const influencerCount = new Map();

        // Count followers for each user
        followsGraph.forEach((followers, user) => {
            followers.forEach(follower => {
                if (!influencerCount.has(follower)) {
                    influencerCount.set(follower, 0);
                }
                influencerCount.set(follower, influencerCount.get(follower) + 1);
            });
        });

        // Create a sorted list based on follower count
        const sortedInfluencers = [...influencerCount.entries()]
            .sort(([, countA], [, countB]) => countB - countA) // Sort in descending order
            .map(([user]) => user); // Return only the user names

        return sortedInfluencers;
    }
}

module.exports = SocialNetwork;
