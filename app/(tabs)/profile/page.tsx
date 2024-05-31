import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if(session.id) {
        const user = await db.user.findUnique({
            where : { id : session.id }
        });

        if(user) return user;
    }

    notFound();
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();

        redirect("/");
    }
    return (
        <div>
            <h1>Welcome! {user?.username}</h1>
            {/* <div className="w-10 h-10 rounded-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage : `url(${user.avatar ?? 'http://www.gravatar.com/avatar/?d=identicon' })` }}></div> */}
            <Image src={user.avatar ?? 'http://www.gravatar.com/avatar/?d=identicon'} width={80} height={80} alt={user.username} className="rounded-full" />
            <form action={logOut}>
                <button className="primary-btn h-10">Logout</button>
            </form>
        </div>
    );
}