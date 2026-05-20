const { clerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config({ path: 'c:/Users/Gustavo/Downloads/neurova/adsniper-saas/.env.local' });

async function checkUsers() {
    try {
        const users = await clerkClient.users.getUserList({ limit: 10 });
        users.forEach(u => {
            console.log('ID:', u.id, '| Email:', u.emailAddresses[0]?.emailAddress, '| Credits:', u.publicMetadata?.credits);
        });
    } catch(e) { console.error(e.message); }
}
checkUsers();
