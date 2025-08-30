import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MapPin, Phone, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleBloodRequests, sampleDonors } from "@/data/sampleData";
import Navbar from "@/components/Navbar";
import EmergencyAlert from "@/components/EmergencyAlert";
import EmergencyNotificationCenter from "@/components/EmergencyNotificationCenter";

const Donor = () => {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    rhFactor: "",
    phone: "",
    address: "",
    pincode: "",
    age: "",
    weight: "",
    lastDonationDate: "",
    medicalConditions: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    const lastDonation = formData.lastDonationDate ? new Date(formData.lastDonationDate) : null;
    const daysSinceLastDonation = lastDonation ? 
      Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)) : 999;

    if (age < 18 || age > 65) {
      return { eligible: false, reason: "Age must be between 18-65 years" };
    }
    if (weight < 50) {
      return { eligible: false, reason: "Weight must be at least 50 kg" };
    }
    if (daysSinceLastDonation < 90) {
      return { eligible: false, reason: "Must wait 90 days between donations" };
    }
    if (formData.medicalConditions.toLowerCase().includes("diabetes") || 
        formData.medicalConditions.toLowerCase().includes("hypertension") ||
        formData.medicalConditions.toLowerCase().includes("heart")) {
      return { eligible: false, reason: "Medical condition may affect eligibility" };
    }

    return { eligible: true, reason: "Eligible to donate" };
  };

  const handleRegister = () => {
    if (!formData.name || !formData.bloodGroup || !formData.rhFactor || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const eligibility = checkEligibility();
    
    toast({
      title: eligibility.eligible ? "Registration Successful" : "Registration Noted",
      description: eligibility.reason,
      variant: eligibility.eligible ? "default" : "destructive"
    });
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return <AlertTriangle className="h-4 w-4 text-medical-orange" />;
      case "urgent":
        return <Clock className="h-4 w-4 text-medical-red" />;
      case "scheduled":
        return <CheckCircle className="h-4 w-4 text-medical-blue" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-blue-light rounded-full mb-4">
            <Users className="h-8 w-8 text-medical-blue" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Donor Dashboard</h1>
          <p className="text-muted-foreground">Register as a donor and help save lives</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Alert - Full Width */}
          <div className="lg:col-span-3">
            <EmergencyAlert />
          </div>

          {/* Donor Registration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-medical-blue" />
                <span>Donor Registration</span>
              </CardTitle>
              <CardDescription>
                Register to become a blood donor and help patients in need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rhFactor">Rh Factor *</Label>
                  <Select value={formData.rhFactor} onValueChange={(value) => handleInputChange("rhFactor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive (+)</SelectItem>
                      <SelectItem value="negative">Negative (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="110001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (18-65)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) (min 50)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="50"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDonationDate">Last Donation Date (if any)</Label>
                <Input
                  id="lastDonationDate"
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={(e) => handleInputChange("lastDonationDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
                <Input
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                  placeholder="Diabetes, Hypertension, etc. (or None)"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <Switch
                  id="availability"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <Label htmlFor="availability" className="text-sm">
                  I am currently available for blood donation
                </Label>
              </div>

              <Button 
                onClick={handleRegister} 
                className="w-full shadow-medical"
                size="lg"
              >
                Register as Donor
              </Button>
            </CardContent>
            </Card>
          </div>

          {/* Blood Requests & Donor Status */}
          <div className="space-y-6">
            {/* Emergency Notification Center */}
            <EmergencyNotificationCenter />
            
            {/* Nearby Blood Requests */}
            {/* Nearby Blood Requests */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-medical-red" />
                  <span>Nearby Blood Requests</span>
                </CardTitle>
                <CardDescription>
                  Patients in your area who need blood
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sampleBloodRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-medical-red border-medical-red">
                          {request.bloodGroup}{request.rhFactor === "positive" ? "+" : "-"}
                        </Badge>
                        <span className="font-medium">{request.unitsNeeded} units</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(request.urgency)}
                        <Badge variant={request.urgency === "immediate" ? "destructive" : "secondary"}>
                          {request.urgency}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{request.hospitalName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{request.contactNumber}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{request.hospitalAddress}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={request.urgency === "immediate" ? "default" : "outline"}
                    >
                      Respond to Request
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Donor Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-medical-green" />
                  <span>Your Donor Status</span>
                </CardTitle>
                <CardDescription>
                  Overview of your donation history and eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-medical-blue-light rounded-lg">
                    <div className="text-2xl font-bold text-medical-blue">3</div>
                    <div className="text-sm text-muted-foreground">Total Donations</div>
                  </div>
                  <div className="text-center p-3 bg-medical-green-light rounded-lg">
                    <div className="text-2xl font-bold text-medical-green">95</div>
                    <div className="text-sm text-muted-foreground">Days Since Last</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Eligibility Status</span>
                    <Badge variant="outline" className="text-medical-green border-medical-green">
                      Eligible
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Availability</span>
                    <Badge variant={isAvailable ? "default" : "secondary"}>
                      {isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lives Potentially Saved</span>
                    <span className="font-bold text-medical-red">9+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donor;