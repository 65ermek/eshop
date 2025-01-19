const ghPages = require('gh-pages');

ghPages.publish(
    'dist', // путь к папке
    {
        branch: 'gh-pages',
        repo: 'https://github.com/65ermek/eshop.git', // замените на ваш репозиторий
    },
    (err) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Deployed successfully!');
        }
    }
);
