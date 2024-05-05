class Patient {
    constructor({ name, age, gender, bloodGroup, phone, email }) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.email = email;
        this.createdAt = new Date();
    }

    toJson() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            bloodGroup: this.bloodGroup,
            phone: this.phone,
            email: this.email,
            createdAt: this.createdAt
        };
    }
}
