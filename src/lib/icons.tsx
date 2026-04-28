import React from 'react';
import { 
  Globe, 
  Code2, 
  LayoutTemplate, 
  Smartphone, 
  PenTool, 
  MessageSquare, 
  Palette, 
  Search, 
  Megaphone, 
  Zap, 
  Award, 
  BarChart3,
  Lightbulb,
  Target,
  Rocket,
  Headphones,
  Settings,
  ShieldCheck
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ReactNode> = {
  'globe': <Globe className="w-8 h-8" />,
  'code': <Code2 className="w-8 h-8" />,
  'layout': <LayoutTemplate className="w-8 h-8" />,
  'smartphone': <Smartphone className="w-8 h-8" />,
  'pen': <PenTool className="w-8 h-8" />,
  'message': <MessageSquare className="w-8 h-8" />,
  'palette': <Palette className="w-8 h-8" />,
  'search': <Search className="w-8 h-8" />,
  'megaphone': <Megaphone className="w-8 h-8" />,
  'zap': <Zap className="w-8 h-8" />,
  'award': <Award className="w-8 h-8" />,
  'chart': <BarChart3 className="w-8 h-8" />,
  'lightbulb': <Lightbulb className="w-8 h-8" />,
  'target': <Target className="w-8 h-8" />,
  'rocket': <Rocket className="w-8 h-8" />,
  'headphones': <Headphones className="w-8 h-8" />,
  'settings': <Settings className="w-8 h-8" />,
  'shield': <ShieldCheck className="w-8 h-8" />
};

export const getIcon = (name: string | undefined): React.ReactNode => {
  if (!name) return ICON_MAP['globe'];
  return ICON_MAP[name] || ICON_MAP['globe'];
};

export const ICON_LIST = Object.keys(ICON_MAP);
