import React, { useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PremiumUpgradeButtonProps {
  floating?: boolean;
}

const PremiumUpgradeButton = ({ floating = false }: PremiumUpgradeButtonProps) => {
  const { user } = useAuth();
  const { profile } = useSupabaseData();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Don't show if user is already premium
  if (profile?.is_paid) {
    return null;
  }

  const handleFlutterwavePayment = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade to premium');
      return;
    }

    setIsLoading(true);

    try {
      // Initialize Flutterwave payment
      const FlutterwaveCheckout = (window as any).FlutterwaveCheckout;
      
      if (!FlutterwaveCheckout) {
        toast.error('Payment system not loaded. Please refresh and try again.');
        setIsLoading(false);
        return;
      }

      FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-b7a4db81d3c0b7a6c3c9e8a2f1d5e3c4-X", // Replace with your actual public key
        tx_ref: `smartexam_${user.id}_${Date.now()}`,
        amount: 2500, // ₦2,500 for premium access
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        customer: {
          email: user.email!,
          phone_number: '',
          name: profile?.full_name || user.email!,
        },
        customizations: {
          title: 'SmartExam NG Premium',
          description: 'Upgrade to Premium for unlimited access',
          logo: 'https://smartexamng.com/logo.png',
        },
        callback: function (data: any) {
          if (data.status === 'successful') {
            // Update user's premium status
            updatePremiumStatus(data.transaction_id);
          } else {
            toast.error('Payment was not successful. Please try again.');
          }
          setIsLoading(false);
          setIsOpen(false);
        },
        onclose: function () {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const updatePremiumStatus = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_paid: true,
          payment_status: 'paid',
          flutterwave_transaction_id: transactionId,
          premium_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success('🎉 Welcome to Premium! You now have unlimited access.');
      // Refresh the page to update UI
      window.location.reload();
    } catch (error) {
      console.error('Error updating premium status:', error);
      toast.error('Payment successful but failed to update account. Please contact support.');
    }
  };

  const baseButtonClasses = "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200";
  
  const floatingClasses = floating 
    ? "fixed bottom-6 right-6 rounded-full p-4 z-50 animate-bounce-in shadow-2xl" 
    : "rounded-lg px-6 py-3";

  const upgradeButton = (
    <Button
      className={`${baseButtonClasses} ${floatingClasses}`}
      onClick={floating ? () => setIsOpen(true) : handleFlutterwavePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Crown className="w-5 h-5 mr-2" />
          {floating ? null : "Upgrade to Premium"}
        </>
      )}
    </Button>
  );

  if (floating) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {upgradeButton}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Crown className="w-6 h-6 text-yellow-500" />
                Upgrade to Premium
              </DialogTitle>
              <DialogDescription className="text-base">
                Unlock unlimited access to all WAEC, JAMB, and NECO past questions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-3">Premium Features:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Unlimited practice questions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    All subjects and exam types
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Detailed explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Offline access
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₦2,500</div>
                <div className="text-sm text-gray-600">One-time payment • Lifetime access</div>
              </div>
              
              <Button
                className={baseButtonClasses + " w-full py-3 text-lg rounded-lg"}
                onClick={handleFlutterwavePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Crown className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return upgradeButton;
};

export default PremiumUpgradeButton;