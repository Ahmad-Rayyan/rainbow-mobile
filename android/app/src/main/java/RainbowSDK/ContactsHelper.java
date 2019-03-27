package RainbowSDK;
/* Import android stuff */

import android.graphics.Bitmap;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Base64;
import android.util.Log;
/* Import rainbow stuff */
import com.ale.infra.application.RainbowContext;
import com.ale.infra.contact.Contact;
import com.ale.infra.contact.RainbowPresence;
/* Import facebook stuff */
import com.ale.rainbowsdk.RainbowSdk;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
/* Import java stuff */
import java.io.ByteArrayOutputStream;
import java.util.List;


public class ContactsHelper {
    /* Define the TAG of the class*/
    private final static String TAG = ContactsHelper.class.getSimpleName();
    /* Define the contact listener that will listen for contacts changes*/
    private Contact.ContactListener contactListener;

    public ContactsHelper(Contact.ContactListener contactListener) {
        this.contactListener = contactListener;
    }

    /* This method will be used to get rainbow contacts */
    public List<Contact> getContacts() {
        Log.d(TAG, "getContacts called");
        return RainbowContext.getInfrastructure().getContactCacheMgr().getRosters().getCopyOfDataList();
    }

    /* This method will be used to process rainbow contacts */
    public WritableArray processContacts(List<Contact> contacts) {
        Log.d(TAG, "processContacts called");
        WritableArray RainbowContacts = Arguments.createArray();
        for (int i = 0; i < contacts.size(); i++) {
            WritableMap contactObject = Arguments.createMap();
            Contact contact = contacts.get(i);
            contact.registerChangeListener(contactListener);
            RainbowPresence contactPres = contact.getPresence();
            String fullName = contact.getFirstName() + " " + contact.getLastName();
            String profilePic = RainbowSdk.instance().contacts().getAvatarUrl(contact.getCorporateId());
            contactObject.putString("contactName", fullName);
            contactObject.putString("contactJId", contact.getImJabberId());
            contactObject.putString("status", String.valueOf(contactPres));
            contactObject.putString("contactProfilePic", profilePic);
            RainbowContacts.pushMap(contactObject);
        }
        return RainbowContacts;
    }

    /* This method is used to convert Bitmap to base64 */
    @RequiresApi(api = Build.VERSION_CODES.FROYO)
    public static String getBses64Image(Bitmap image) {
        Log.d(TAG, "getBses64Image: get the base54 for " + image);
        if (image != null) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            image.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
        }
        return null;
    }
}
