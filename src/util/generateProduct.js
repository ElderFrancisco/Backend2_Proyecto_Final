import { faker } from '@faker-js/faker';

export default () => {
  const randomCode = Math.random().toString(36).substring(2, 8);
  const arrayThumnnail = [];
  arrayThumnnail.push(faker.image.urlLoremFlickr());
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: randomCode,
    price: faker.number.int(),
    status: faker.datatype.boolean(),
    stock: faker.number.int(),
    category: faker.commerce.department(),
    thumbnail: arrayThumnnail,
  };
};
