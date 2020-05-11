const users = [];

const findUserById = (id) => users.find((user) => user.id === id);

const findUserByEmail = (email) => users.find((user) => user.email === email);

const addUser = (user) => {
    const lengthOfUsers = users.push(user);
    console.log(users[lengthOfUsers - 1]);
    return users[lengthOfUsers - 1];
};

module.exports = {
    findUserById,
    addUser,
    findUserByEmail,
};
