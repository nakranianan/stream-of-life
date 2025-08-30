import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Phone, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleBloodRequests, sampleDonors, sampleBloodBanks, getCompatibleDonors } from "@/data/sampleData";
import Navbar from "@/components/Navbar";
import EmergencyBloodRequest from "@/components/EmergencyBloodRequest";

const Patient = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    rhFactor: "",
    unitsNeeded: "",
    urgency: "",
    hospitalName: "",
    hospitalAddress: "",
    pincode: "",
    contactNumber: "",
    additionalNotes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = () => {
    if (!formData.patientName || !formData.bloodGroup || !formData.rhFactor || !formData.unitsNeeded) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Blood Request Submitted",
      description: "Your request has been sent to nearby donors and blood banks",
      variant: "default"
    });

    // Reset form
    setFormData({
      patientName: "",
      bloodGroup: "",
      rhFactor: "",
      unitsNeeded: "",
      urgency: "",
      hospitalName: "",
      hospitalAddress: "",
      pincode: "",
      contactNumber: "",
      additionalNotes: ""
    });
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return <AlertTriangle className="h-4 w-4 text-medical-orange" />;
      case "urgent":
        return <Clock className="h-4 w-4 text-medical-red" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-medical-blue" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-medical-orange" />;
      case "matched":
        return <CheckCircle className="h-4 w-4 text-medical-green" />;
      case "fulfilled":
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-red-light rounded-full mb-4">
            <Heart className="h-8 w-8 text-medical-red" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">Request blood from nearby donors and blood banks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Blood Request Component */}
          <div className="lg:col-span-2 mb-8">
            <EmergencyBloodRequest />
          </div>

          {/* Standard Blood Request Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-medical-red" />
                <span>Create Blood Request</span>
              </CardTitle>
              <CardDescription>
                Fill in the details to request blood from our network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
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
                  <Label htmlFor="unitsNeeded">Units Needed *</Label>
                  <Input
                    id="unitsNeeded"
                    type="number"
                    min="1"
                    value={formData.unitsNeeded}
                    onChange={(e) => handleInputChange("unitsNeeded", e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (Life threatening)</SelectItem>
                    <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                    <SelectItem value="scheduled">Scheduled (Within a week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    placeholder="Enter hospital name"
                  />
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

              <div className="space-y-2">
                <Label htmlFor="hospitalAddress">Hospital Address</Label>
                <Textarea
                  id="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={(e) => handleInputChange("hospitalAddress", e.target.value)}
                  placeholder="Enter complete hospital address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  placeholder="Any additional information..."
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleSubmitRequest} 
                className="w-full shadow-medical"
                size="lg"
              >
                Submit Blood Request
              </Button>
            </CardContent>
          </Card>

          {/* Request Status & Matches */}
          <div className="space-y-6">
            {/* Current Requests */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-medical-blue" />
                  <span>Your Blood Requests</span>
                </CardTitle>
                <CardDescription>
                  Track the status of your current requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sampleBloodRequests.slice(0, 2).map((request) => (
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
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.hospitalAddress}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Nearby Blood Banks */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-medical-green" />
                  <span>Nearby Blood Banks</span>
                </CardTitle>
                <CardDescription>
                  Blood banks in your area with available inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sampleBloodBanks.slice(0, 2).map((bank) => (
                  <div key={bank.id} className="border rounded-lg p-4 mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{bank.name}</h4>
                      <Badge variant="outline" className="text-medical-green border-medical-green">
                        {bank.operatingHours}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{bank.pincode}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{bank.contactNumber}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{bank.address}</p>
                    <div className="flex flex-wrap gap-1">
                      {bank.inventory.slice(0, 4).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item.bloodGroup}{item.rhFactor === "positive" ? "+" : "-"}: {item.unitsAvailable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;