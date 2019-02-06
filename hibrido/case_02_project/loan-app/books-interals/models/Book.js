const schema = {
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  year_of_publication: { type: Number },
  author: { type: String },
  publisher: { type: String },
  small_img_path: { type: String },
  medium_img_path: { type: String },
  large_img_path: { type: String },
};

const name = 'Book';

module.exports = {
  name,
  schema,
};
