class User {
    constructor({ username, email, passwordHash }) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;  
        this.createdAt = new Date();
    }

    toJson() {
        return {
            username: this.username,
            email: this.email,
            passwordHash: this.passwordHash,
            createdAt: this.createdAt
        };
    }
}

