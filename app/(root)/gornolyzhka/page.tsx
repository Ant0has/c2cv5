import GornolyghkaPage from "@/pages-list/gornolyzhka";
import type { Metadata } from "next";
import { BASE_URL } from "@/shared/constants";
import { hubService } from "@/shared/api/hub.service";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const hub = await hubService.getBySlug('gornolyzhka');
    return {
        title: hub?.seoTitle || '',
        description: hub?.seoDescription || '',
        keywords: hub?.seoKeywords || '',
        alternates: {
            canonical: `${BASE_URL}/gornolyghka`,
        },
    };
}

export default async function Page() {
    const hub = await hubService.getBySlug('gornolyzhka');
    if (!hub) {
        notFound();
    }
    return <GornolyghkaPage hub={hub} />;
}   