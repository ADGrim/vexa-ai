import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import VoiceSidebar from '@/components/VoiceSidebar';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import TypewriterBubble from '@/components/TypewriterBubble';
import WaveButton from '@/components/WaveButton';
import MobiusStrip from '@/components/effects/MobiusStrip';
import ThreeMobiusStrip from '@/components/effects/ThreeMobiusStrip';
import ThreeMobiusStripV2 from '@/components/effects/ThreeMobiusStripV2';
import useMicVolume from '@/hooks/useMicVolume';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VoiceDemo() {
  const [simulationMode, setSimulationMode] = useState(true);
  const volume = useMicVolume(simulationMode);
  const [listening, setListening] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState('visualizer');
  const [mobiusType, setMobiusType] = useState<'2d' | '3d' | '3dv2'>('3dv2');
  
  // Reference to the 3D Mobius strip mesh for the interactive controls
  const mobiusRef = useRef<THREE.Mesh | null>(null);
  
  const demoText = "This is a demonstration of the futuristic chat interface with circular message bubbles, gradient backgrounds, and interactive voice visualizations. Vexa's advanced multimodal AI capabilities are displayed through dynamic animations and responsive UI elements.";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <VoiceSidebar volume={volume} isActive={listening} />
      
      <div className="ml-20 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Vexa Voice Interface Components
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-3">
              Explore the futuristic UI components with voice-activated animations and responsive design elements.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 backdrop-blur-sm text-purple-300">
                Voice Reactivity
              </span>
              <span className="px-2 py-1 rounded-full bg-pink-600/20 border border-pink-500/30 backdrop-blur-sm text-pink-300">
                Circular Chat Bubbles
              </span>
              <span className="px-2 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-sm text-indigo-300">
                Typewriter Animations
              </span>
              <span className="px-2 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm text-blue-300">
                Möbius Strip Visualizations
              </span>
              <span className="px-2 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 backdrop-blur-sm text-cyan-300">
                Three.js 3D Effects
              </span>
            </div>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Settings card */}
            <Card className="bg-black/40 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle>Settings & Controls</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure the demo environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Simulation Mode</span>
                    <Button 
                      variant={simulationMode ? "default" : "outline"}
                      onClick={() => setSimulationMode(!simulationMode)}
                      className="w-24"
                    >
                      {simulationMode ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Voice Listening</span>
                    <Button 
                      variant={listening ? "destructive" : "default"}
                      onClick={() => setListening(!listening)}
                      className="w-24"
                    >
                      {listening ? "Stop" : "Start"}
                    </Button>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm mb-2">Current Volume: {Math.round(volume * 100)}%</div>
                    <div className="w-full bg-gray-700/30 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Voice visualizer preview */}
            <Card className="bg-black/40 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle>Voice Activation</CardTitle>
                <CardDescription className="text-gray-400">
                  Interactive voice components
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-8 py-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">Wave Button</p>
                  <WaveButton 
                    onClick={() => setListening(!listening)}
                    listening={listening}
                  />
                </div>
                
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">Mobius Visualizer</p>
                    {volume > 0 && (
                      <div className="transform scale-75">
                        <MobiusStrip volume={volume} color="#9333ea" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Demo tabs */}
          <Tabs value={activeDemoTab} onValueChange={setActiveDemoTab} className="mb-8">
            <TabsList className="bg-black/40 border-white/10">
              <TabsTrigger value="visualizer">Voice Visualizer</TabsTrigger>
              <TabsTrigger value="bubbles">Chat Bubbles</TabsTrigger>
              <TabsTrigger value="typewriter">Typewriter Effect</TabsTrigger>
              <TabsTrigger value="mobius">3D Mobius Strip</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualizer" className="mt-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle>Voice Visualizer</CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualize voice input with a Mobius strip animation
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <VoiceVisualizer />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bubbles" className="mt-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle>Chat Bubbles</CardTitle>
                  <CardDescription className="text-gray-400">
                    Futuristic circular message bubbles with gradient effects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 py-8">
                  <div className="flex flex-col gap-4">
                    <div className="ml-auto max-w-md">
                      <TypewriterBubble 
                        text="Hello Vexa! I'm interested in seeing your new futuristic interface design."
                        isUser={true}
                      />
                    </div>
                    
                    <div className="max-w-md">
                      <TypewriterBubble 
                        text={demoText}
                        isUser={false}
                      />
                    </div>
                    
                    <div className="ml-auto max-w-md">
                      <TypewriterBubble 
                        text="The circular bubbles look fantastic! Can you make the animations more responsive to voice input?"
                        isUser={true}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="typewriter" className="mt-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle>Typewriter Animation</CardTitle>
                  <CardDescription className="text-gray-400">
                    Interactive text typing animation with customizable speed
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="space-y-8">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Slow typing:</div>
                      <TypewriterBubble 
                        text="Vexa AI is thinking carefully about this response..."
                        isUser={false}
                        typingSpeed="slow"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Normal typing:</div>
                      <TypewriterBubble 
                        text="This is the default typing speed for most conversations."
                        isUser={false}
                        typingSpeed="normal"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Fast typing:</div>
                      <TypewriterBubble 
                        text="Quick response when the AI has immediate information ready!"
                        isUser={false}
                        typingSpeed="fast"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobius" className="mt-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle>3D Mobius Strip</CardTitle>
                  <CardDescription className="text-gray-400">
                    Advanced 3D visualization with Three.js
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="flex space-x-2 justify-center">
                      <Button 
                        variant={mobiusType === '2d' ? 'default' : 'outline'}
                        onClick={() => setMobiusType('2d')}
                        className="w-auto"
                      >
                        2D Canvas
                      </Button>
                      <Button 
                        variant={mobiusType === '3d' ? 'default' : 'outline'}
                        onClick={() => setMobiusType('3d')}
                        className="w-auto"
                      >
                        3D Component
                      </Button>
                      <Button 
                        variant={mobiusType === '3dv2' ? 'default' : 'outline'}
                        onClick={() => setMobiusType('3dv2')}
                        className="w-auto"
                      >
                        3D Modular API
                      </Button>
                    </div>
                    
                    <div className="flex justify-center py-4">
                      {mobiusType === '2d' ? (
                        <div className="transform scale-150">
                          <MobiusStrip volume={volume} color="#6d28d9" size="lg" />
                        </div>
                      ) : mobiusType === '3d' ? (
                        <ThreeMobiusStrip 
                          volume={volume} 
                          size={240} 
                          color="#6d28d9" 
                        />
                      ) : (
                        <ThreeMobiusStripV2
                          volume={volume}
                          size={240}
                          color="#6d28d9"
                          wireframe={true}
                          meshRef={mobiusRef}
                        />
                      )}
                    </div>
                    
                    <div className="text-center text-sm text-gray-400 max-w-lg">
                      <p>This Mobius strip visualization reacts to voice input volume. The rotation speed, 
                      glow intensity, and opacity all change based on voice activity.</p>
                      <p className="mt-2">Try adjusting the volume slider above to see the effect.</p>
                      <p className="mt-4">
                        <strong>Available Implementations:</strong>
                      </p>
                      <ul className="list-disc list-inside text-left mt-2 space-y-1">
                        <li><strong>2D Canvas:</strong> Lightweight SVG-based Mobius visualization</li>
                        <li><strong>3D Component:</strong> Basic Three.js torus knot approximation</li>
                        <li><strong>3D Modular API:</strong> Mathematically accurate Mobius strip using parametric equations</li>
                      </ul>
                    </div>
                    
                    {mobiusType === '3dv2' && (
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (mobiusRef.current && mobiusRef.current.material instanceof THREE.MeshStandardMaterial) {
                              mobiusRef.current.material.wireframe = !mobiusRef.current.material.wireframe;
                            }
                          }}
                          className="text-xs"
                        >
                          Toggle Wireframe
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (mobiusRef.current && mobiusRef.current.rotation) {
                              mobiusRef.current.rotation.set(0, 0, 0);
                            }
                          }}
                          className="text-xs"
                        >
                          Reset Rotation
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (mobiusRef.current && mobiusRef.current.material instanceof THREE.MeshStandardMaterial) {
                              mobiusRef.current.material.metalness = mobiusRef.current.material.metalness < 0.5 ? 0.9 : 0.1;
                            }
                          }}
                          className="text-xs"
                        >
                          Toggle Metalness
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}