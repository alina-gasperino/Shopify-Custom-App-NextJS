import Head from 'next/head'
import {connectToDatabase} from '../lib/mongodb'

export default function Connect({ members}){
    return (
        <div>
            <Head>
                <title>MongoDB with Next</title>
            </Head>
            <main>
                {members.map((member, index) => (
                    <div key={index}>
                        <p>{member.name}</p>
                    </div>
                ))}
            </main>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { db } = await connectToDatabase();

    const members = await db
        .collection("shopify_customers")
        .find({})
        .sort({ metacritic: -1 })
        .limit(2000)
        .toArray();


        return {
            props: {
                members: JSON.parse(JSON.stringify(members))
            }
        }
      
}