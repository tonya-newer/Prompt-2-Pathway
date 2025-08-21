import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; 
import { Mic } from 'lucide-react';
import { fetchVoiceSettings, updateVoiceSettings } from '@/store/voiceSettingsSlice';
import { RootState } from '@/store';

export const VoiceSettings = () => {
	const { toast } = useToast();
	const dispatch = useDispatch();
	const [settings, setSettings] = useState({
		voiceLabel: '',
    provider: 'upload',
		languageCode: 'en-US',
		defaultVolume: 30,
		playbackSpeed: 1,
		fallbackToNativeTTS: false,
		elevenLabs: {
			voiceId: '',
			stability: 0.8,
			similarityBoost: 0.88
		}
	});

	const voiceSettingsFromStore = useSelector((state: RootState) => state.voiceSettings.settings);

	useEffect(() => {
    dispatch(fetchVoiceSettings());
  }, [dispatch]);

	useEffect(() => {
    if (voiceSettingsFromStore) {
      setSettings(voiceSettingsFromStore);
    }
  }, [voiceSettingsFromStore]);

	const handleSaveVoiceSettings = async () => {
    try {
      await dispatch(updateVoiceSettings(settings)).unwrap();
      toast({
        title: "Voice Settings Saved",
        description: "Voice scripts and settings have been updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save voice settings",
      });
    }
  };

	return (
		<div>
			<div className="flex justify-between items-center py-3">
				<h3 className="text-lg font-semibold">Voice Settings</h3>
				<Button onClick={handleSaveVoiceSettings} className="flex items-center">
					<Mic className="h-4 w-4 mr-2" />
					Save Voice Settings
				</Button>
			</div>

			<div className="grid gap-6">
        {/* General Voice Info */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">General Voice Information</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="voiceLabel">Voice Label</Label>
              <Input
                id="voiceLabel"
                value={settings.voiceLabel}
                onChange={(e) =>
                  setSettings({ ...settings, voiceLabel: e.target.value })
                }
                placeholder="Enter voice label"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select 
                value={settings.provider} 
                onValueChange={(value: 'upload' | 'elevenLabs' | 'nativeTTS') => 
                  setSettings({...settings, provider: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="elevenLabs">ElevenLabs</SelectItem>
									<SelectItem value="nativeTTS">nativeTTS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="languageCode">Language Code</Label>
              <Input
                id="languageCode"
                value={settings.languageCode}
                onChange={(e) =>
                  setSettings({ ...settings, languageCode: e.target.value })
                }
                placeholder="en-US"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="defaultVolume">Default Volume (%)</Label>
              <Input
                id="defaultVolume"
                type="number"
                min={0}
                max={200}
                value={settings.defaultVolume}
                onChange={(e) =>
                  setSettings({ ...settings, defaultVolume: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="playbackSpeed">Playback Speed</Label>
              <Input
                id="playbackSpeed"
                type="number"
                step={0.1}
                min={0.5}
                max={1.5}
                value={settings.playbackSpeed}
                onChange={(e) =>
                  setSettings({ ...settings, playbackSpeed: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2 mt-2">
							<Checkbox
								id="fallbackToNativeTTS"
								checked={settings.fallbackToNativeTTS}
								onCheckedChange={(checked) =>
									setSettings({ ...settings, fallbackToNativeTTS: Boolean(checked) })
								}
							/>
							<Label htmlFor="fallbackToNativeTTS" className="select-none">
								Fallback to Native TTS
							</Label>
						</div>
          </div>
        </Card>

        {/* ElevenLabs Specific */}
        {settings.provider === 'elevenLabs' && (
          <Card className="p-6 bg-gray-50 border-gray-200">
            <h4 className="text-lg font-semibold mb-4">ElevenLabs-Specific Settings</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="voiceId">ElevenLabs Voice ID</Label>
                <Input
                  id="voiceId"
                  value={settings.elevenLabs.voiceId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      elevenLabs: { ...settings.elevenLabs, voiceId: e.target.value },
                    })
                  }
                  placeholder="Enter ElevenLabs Voice ID"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stability">Stability (0–1)</Label>
                <Input
                  id="stability"
                  type="number"
                  step={0.01}
                  min={0}
                  max={1}
                  value={settings.elevenLabs.stability}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      elevenLabs: {
                        ...settings.elevenLabs,
                        stability: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="similarityBoost">Similarity Boost (0–1)</Label>
                <Input
                  id="similarityBoost"
                  type="number"
                  step={0.01}
                  min={0}
                  max={1}
                  value={settings.elevenLabs.similarityBoost}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      elevenLabs: {
                        ...settings.elevenLabs,
                        similarityBoost: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
		</div>
	)
}