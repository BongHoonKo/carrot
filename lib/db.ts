import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
    // const user = await db.user.create({
    //     data : {
    //         username : 'TEST'
    //         , phone : '01033039838'
    //     },
    // });

    const user = await db.user.findMany({
        where : {
            username : {
                contains : 'est'
            }
        }
    });

    console.log('USER ==> ', user);
}

// async function test2() {
//     const token = await db.sMSToken.create({
//         data : {
//             token : '1212112'
//             , user : {
//                 connect : {
//                     id : 2
//                 }
//             }
//         }
//     });

//     console.log('token ==> ', token);
// }

async function test3() {
    const token = await db.sMSToken.findUnique({
        where : {
            id : 1
        },
        include : {
            user : true
        }
    });

    console.log('test3 ==>', token)
}
test3();

export default db;