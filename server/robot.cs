using System;
using Raspberry.IO.Components.Controllers.Pca9685;
using System.Threading;

namespace PiCarMyo
{
	public class BaseMovements
	{
		#region Privates

		Pca9685Connection baseDevice;

		#endregion

		#region Properties

		public Pca9685Connection BaseDevice {
			get {
				return baseDevice;
			}
			set {
				baseDevice = value;
			}
		}

		#endregion
		#region Mouvments

		public void Forward (int duration, int steering)
		{
			Console.WriteLine ("BaseMovements :: Forward : " + duration);

			if (steering > 0) {
				baseDevice.SetPwm (PwmChannel.C0, 0, duration); //RBF
				baseDevice.SetPwm (PwmChannel.C1, 0, 150); //RBF
				baseDevice.SetPwm (PwmChannel.C2, 0, duration - steering); //LBF
				baseDevice.SetPwm (PwmChannel.C3, 0, 150); //LBF
				baseDevice.SetPwm (PwmChannel.C4, 0, duration - steering); //LFF
				baseDevice.SetPwm (PwmChannel.C5, 0, 150); //LFF
				baseDevice.SetPwm (PwmChannel.C6, 0, duration); //RFF
				baseDevice.SetPwm (PwmChannel.C7, 0, 150); //RFF
			} else {
				baseDevice.SetPwm (PwmChannel.C0, 0, duration - steering); //RBF
				baseDevice.SetPwm (PwmChannel.C1, 0, 150); //RBF
				baseDevice.SetPwm (PwmChannel.C2, 0, duration); //LBF
				baseDevice.SetPwm (PwmChannel.C3, 0, 150); //LBF
				baseDevice.SetPwm (PwmChannel.C4, 0, duration); //LFF
				baseDevice.SetPwm (PwmChannel.C5, 0, 150); //LFF
				baseDevice.SetPwm (PwmChannel.C6, 0, duration - steering); //RFF
				baseDevice.SetPwm (PwmChannel.C7, 0, 150); //RFF	
			}



			//Thread.Sleep (100);
		}

		public void Backward (int duration, int steering)
		{
			Console.WriteLine ("BaseMovements :: Backward : " + duration);

			if (steering > 0) {
				baseDevice.SetPwm (PwmChannel.C0, 0, 150); //RBF
				baseDevice.SetPwm (PwmChannel.C1, 0, duration); //RBF
				baseDevice.SetPwm (PwmChannel.C2, 0, 150); //LBF
				baseDevice.SetPwm (PwmChannel.C3, 0, duration - -steering); //LBF
				baseDevice.SetPwm (PwmChannel.C4, 0, 150); //LFF
				baseDevice.SetPwm (PwmChannel.C5, 0, duration - -steering); //LFF
				baseDevice.SetPwm (PwmChannel.C6, 0, 150); //RFF
				baseDevice.SetPwm (PwmChannel.C7, 0, duration); //RFF
			} else {
				baseDevice.SetPwm (PwmChannel.C0, 0, 150); //RBF
				baseDevice.SetPwm (PwmChannel.C1, 0, duration - steering); //RBF
				baseDevice.SetPwm (PwmChannel.C2, 0, 150); //LBF
				baseDevice.SetPwm (PwmChannel.C3, 0, duration); //LBF
				baseDevice.SetPwm (PwmChannel.C4, 0, 150); //LFF
				baseDevice.SetPwm (PwmChannel.C5, 0, duration); //LFF
				baseDevice.SetPwm (PwmChannel.C6, 0, 150); //RFF
				baseDevice.SetPwm (PwmChannel.C7, 0, duration - steering); //RFF
			}

			//Thread.Sleep (100);
		}
		#endregion

		#region Constructor

		public BaseMovements (Pca9685Connection deviceIn)
		{
			baseDevice = deviceIn;
		}

		#endregion
	}
}

/*
device.SetPwm (PwmChannel.C0, 0, 3000); //RBF
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C0, 0, 150);

device.SetPwm (PwmChannel.C1, 0, 3000); //RBR
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C1, 0, 150);

device.SetPwm (PwmChannel.C2, 0, 2000); //LBF
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C2, 0, 150);

device.SetPwm (PwmChannel.C3, 0, 2000); //LBR
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C3, 0, 150);

device.SetPwm (PwmChannel.C4, 0, 2000); //LFF
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C4, 0, 150);

device.SetPwm (PwmChannel.C5, 0, 2000); //LFB
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C5, 0, 150);

device.SetPwm (PwmChannel.C6, 0, 2000); //RFF
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C6, 0, 150);

device.SetPwm (PwmChannel.C7, 0, 2000); //RBR
Thread.Sleep (2000);
device.SetPwm (PwmChannel.C7, 0, 150);

 */
