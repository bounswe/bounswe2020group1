const handleBanUser = require('../AdminPanel');
const handleDeleteComment = require('../AdminPanel');

test('checks if delete user memetc works', () => {
    this.setState({username: "memetc"})
    expect(handleBanUser()).toBe("user banned");
});

test('checks if delete user memetc works', () => {
    this.setState({comment_id: "memetc"})
    expect(handleDeleteComment()).toBe("comment deleted?");
});
