
"use client";

import { SectionTitle } from '@/components/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, ScanLine, Lightbulb, CloudSun, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  type: 'disease_detection' | 'crop_recommendation' | 'weather_check' | 'profile_update';
  description: string;
  timestamp: Date;
  details?: Record<string, any>;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'disease_detection',
    description: 'Detected "Late Blight" on tomato crop image.',
    timestamp: new Date(2024, 6, 25, 10, 30, 0),
    details: { confidence: 0.85, treatmentsSuggested: ['Fungicide A', 'Crop Rotation'] },
  },
  {
    id: '2',
    type: 'crop_recommendation',
    description: 'Generated crop recommendations for Napa Valley.',
    timestamp: new Date(2024, 6, 24, 14, 15, 0),
    details: { recommendedCrops: ['Grapes', 'Olives'], soilPh: 6.5 },
  },
  {
    id: '3',
    type: 'weather_check',
    description: 'Checked weather forecast for Green Valley Farms.',
    timestamp: new Date(2024, 6, 23, 8, 0, 0),
    details: { temp: '28°C', condition: 'Sunny' },
  },
  {
    id: '4',
    type: 'profile_update',
    description: 'Updated farm name to "Sunshine Meadows".',
    timestamp: new Date(2024, 6, 22, 16, 45, 0),
  },
   {
    id: '5',
    type: 'disease_detection',
    description: 'Analyzed wheat crop image, no significant disease detected.',
    timestamp: new Date(2024, 6, 21, 11,0,0),
    details: { confidence: 0.1, diseaseName: "None" },
  },
];

const ActivityIcon = ({ type }: { type: ActivityLog['type'] }) => {
  switch (type) {
    case 'disease_detection':
      return <ScanLine className="h-5 w-5 text-primary" />;
    case 'crop_recommendation':
      return <Lightbulb className="h-5 w-5 text-primary" />;
    case 'weather_check':
      return <CloudSun className="h-5 w-5 text-primary" />;
    case 'profile_update':
      return <CheckCircle className="h-5 w-5 text-primary" />;
    default:
      return <History className="h-5 w-5 text-primary" />;
  }
};

const TypeBadge = ({ type }: { type: ActivityLog['type'] }) => {
    let label = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";

    switch(type) {
        case 'disease_detection': variant = "secondary"; break;
        case 'crop_recommendation': variant = "default"; break; // primary-like
        case 'weather_check': variant = "outline"; break; // accent-like
        case 'profile_update': variant = "secondary"; break; // more neutral
    }
    if (type === 'crop_recommendation') { // Make it more distinct
        return <Badge className="bg-primary/20 text-primary border-primary/50">{label}</Badge>
    }
     if (type === 'weather_check') {
        return <Badge className="bg-accent/20 text-accent-foreground border-accent/50">{label}</Badge>
    }


    return <Badge variant={variant}>{label}</Badge>;
}


export default function ActivityHistoryPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Your Activity History"
        description="Review your past interactions and activities within AgriAssist."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="text-primary"/>Recent Activities</CardTitle>
          <CardDescription>Showing your latest 20 activities. More detailed logs might be available under specific modules.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockActivityLogs.length === 0 ? (
            <p className="text-muted-foreground">No activities recorded yet.</p>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {mockActivityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/30 transition-colors">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ActivityIcon type={log.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{log.description}</p>
                        <TypeBadge type={log.type} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(log.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <Card className="mt-2 bg-secondary/50 border-primary/20 p-3">
                          <CardContent className="text-xs space-y-1 p-0">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex">
                                <span className="font-semibold capitalize text-primary/80 min-w-[120px]">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                <span className="text-foreground/80">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
