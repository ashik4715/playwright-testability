import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateRandomEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  static generateRandomUsername(): string {
    return faker.internet.userName().toLowerCase();
  }

  static generateRandomPassword(): string {
    return faker.internet.password({ length: 12, memorable: false });
  }

  static generateArticleTitle(): string {
    return `Test Article - ${faker.lorem.words(3)} - ${Date.now()}`;
  }

  static generateArticleDescription(): string {
    return faker.lorem.sentence();
  }

  static generateArticleBody(): string {
    return faker.lorem.paragraphs(3);
  }

  static generateRandomTag(): string {
    const tags = ['react', 'angular', 'vue', 'javascript', 'typescript', 'node', 'python', 'docker', 'kubernetes', 'testing'];
    return faker.helpers.arrayElement(tags);
  }

  static generateMultipleTags(count: number = 2): string[] {
    const availableTags = ['react', 'angular', 'vue', 'javascript', 'typescript', 'node', 'python', 'docker', 'kubernetes', 'testing'];
    return faker.helpers.arrayElements(availableTags, count);
  }

  static generateUserBio(): string {
    return faker.lorem.sentence();
  }

  static generateInvalidEmail(): string {
    const invalidEmails = ['invalid', 'invalid@', '@test.com', 'test@.com', 'test space@test.com'];
    return faker.helpers.arrayElement(invalidEmails);
  }

  static generateShortPassword(): string {
    return faker.internet.password({ length: 3 });
  }

  static generateExistingTag(): string {
    return faker.helpers.arrayElement(['test', 'coding', 'programming', 'javascript', 'welcome']);
  }
}

export const testUser = {
  email: 'artem@bondaracademy.com',
  username: 'Artem Bondar',
  password: 'password123',
  bio: 'Test user bio',
  image: 'https://example.com/avatar.jpg',
};

export const testTags = ['test', 'coding', 'programming', 'javascript', 'welcome'];