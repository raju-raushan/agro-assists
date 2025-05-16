import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CloudSun, History, Lightbulb, ScanLine, Users } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
const features = [
  {
    title: "Crop Disease Detection",
    description: "Upload an image of your crop to identify potential diseases and get treatment suggestions.",
    href: "/crop-disease",
    icon: ScanLine,
    imgSrc: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Crop disease detection",
    aiHint: "plant disease"
  },
  {
    title: "AI Crop Recommendations",
    description: "Get personalized crop recommendations based on your farm's conditions and market demand.",
    href: "/crop-recommendations",
    icon: Lightbulb,
    imgSrc: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    imgAlt: "AI crop recommendations",
    aiHint: "healthy crops"
  },
  {
    title: "Weather Intelligence",
    description: "Access hyperlocal weather forecasts to make informed decisions for your farm.",
    href: "/weather",
    icon: CloudSun,
    imgSrc: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Weather intelligence",
    aiHint: "farm weather"
  },
  {
    title: "Farmer's Community",
    description: "Connect with fellow farmers, share insights, and discuss farming techniques.",
    href: "/community",
    icon: Users,
    imgSrc: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Farmer's community",
    aiHint: "farmers community"
  },
  {
    title: "Activity History",
    description: "Review your past activities and interactions within the app.",
    href: "/activity-history",
    icon: History,
    imgSrc: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
    imgAlt: "Activity history",
    aiHint: "log records"
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Welcome to AgroAssist!"
        description="Your AI-powered partner for smarter farming."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <CardDescription>Explore the features designed to help you optimize your farming practices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <div className="relative h-48 w-full">
                  <Image
                    src={feature.imgSrc}
                    alt={feature.imgAlt}
                    fill // Changed from layout="fill" to fill for Next 13+
                    objectFit="cover"
                    data-ai-hint={feature.aiHint}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="min-h-[3em]">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={feature.href} passHref legacyBehavior>
                    <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
                      <a>
                        Go to {feature.title.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

