import type { MetadataRoute } from 'next'
import { getPublicFlashcardSetIds, getPublicUsernames } from "./_lib/data";

const getDeploymentURL = () => {
    if (process.env.VERCEL_ENV === "production") {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "flashcard-app-eight-theta.vercel.app"}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const BASE_URL = getDeploymentURL();
    const SET_URL = BASE_URL + '/set';
    const ALL_SETS_URL = BASE_URL + '/all-sets';
    const USER_SETS_URL = BASE_URL + '/sets'

    const [publicSets, publicUsers] = await Promise.all([
        getPublicFlashcardSetIds(),
        getPublicUsernames()
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: ALL_SETS_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    const setRoutes: MetadataRoute.Sitemap = publicSets.map(({ id }) => ({
        url: `${SET_URL}/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const userRoutes: MetadataRoute.Sitemap = publicUsers.map((username) => ({
        url: `${USER_SETS_URL}/${username}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));


    return [...staticRoutes, ...setRoutes, ...userRoutes];
}