app.post('/account/register', accountControler.registerAccount);
app.get('/account', accountControler.listAccounts);
app.post('/account/login', accountControler.authenticate);

app.get('/books', bookControler.listBooks);
app.get('/books/:book_id/exemplar', bookControler.listExemplars);

function compileRouters(plugins) {}

module.exports = compileRouters;
