const handleBanUser = require('../AdminPanel');
const handleDeleteComment = require('../AdminPanel');

test('checks if delete user memetc works', () => {
    this.setState({username: "memetc"})
    expect(handleBanUser()).toBe("user banned");
});

test('checks if remove a comment works', () => {
    this.setState({comment_id: 1})
    expect(handleDeleteComment()).toBe("comment deleted?");
});
