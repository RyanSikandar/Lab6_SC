const SocialNetwork = require('../../src/twitter/SocialNetwork');

describe('SocialNetwork', () => {

  test('guessFollowsGraph with an empty list', () => {
    const followsGraph = SocialNetwork.guessFollowsGraph([]);
    expect(followsGraph).toEqual(new Map());
  });

  test('guessFollowsGraph with tweets that have no mentions', () => {
    const tweets = [
      { author: 'user1', text: 'Just enjoying the weather' },
      { author: 'user2', text: 'Hello world!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(tweets);
    expect(followsGraph).toEqual(new Map());
  });

  test('guessFollowsGraph with tweets that have mentions', () => {
    const tweets = [
      { author: 'user1', text: 'Hey @user2, check this out!' },
      { author: 'user2', text: '@user3 thanks for the support!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(tweets);
    expect(followsGraph.get('user1')).toEqual(new Set(['user2']));
    expect(followsGraph.get('user2')).toEqual(new Set(['user3']));
  });

  test('guessFollowsGraph with multiple mentions in a tweet', () => {
    const tweets = [
      { author: 'user1', text: '@user2 and @user3 you both are awesome!' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(tweets);
    expect(followsGraph.get('user1')).toEqual(new Set(['user2', 'user3']));
  });

  test('guessFollowsGraph with multiple tweets from the same author', () => {
    const tweets = [
      { author: 'user1', text: 'Hello @user2' },
      { author: 'user1', text: 'Hi @user3' },
    ];
    const followsGraph = SocialNetwork.guessFollowsGraph(tweets);
    expect(followsGraph.get('user1')).toEqual(new Set(['user2', 'user3']));
  });

  test('influencers with an empty follows graph', () => {
    const followsGraph = new Map();
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual([]);
  });

  test('influencers with a single user having no followers', () => {
    const followsGraph = new Map([['user1', new Set()]]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual([]);
  });

  test('influencers with a single influencer', () => {
    const followsGraph = new Map([['user1', new Set(['user2'])]]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(['user2']);
  });
  test('influencers with multiple users having varying follower counts', () => {
    const followsGraph = new Map([
        ['user1', new Set(['user2'])],
        ['user2', new Set(['user3'])],
        ['user3', new Set(['user2', 'user1'])],
    ]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(expect.arrayContaining(['user2', 'user1', 'user3'])); // user2 and user3 are top influencers
});


  test('influencers with users having equal number of followers', () => {
    const followsGraph = new Map([
      ['user1', new Set(['user3'])],
      ['user2', new Set(['user3'])],
    ]);
    const influencers = SocialNetwork.influencers(followsGraph);
    expect(influencers).toEqual(expect.arrayContaining(['user3'])); // user3 has two followers, user1 and user2
  });
});
