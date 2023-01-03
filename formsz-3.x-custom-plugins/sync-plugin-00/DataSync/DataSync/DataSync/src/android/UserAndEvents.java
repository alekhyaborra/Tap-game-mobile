package cordova.plugin.data.sync.interfaces.models;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

/**
 * Created by mmvb45 on 08-07-2019.
 */

public class UserAndEvents {
    public UserAndEvents(JsonObject user, JsonArray events) {
        this.events = events;
        this.user = user;
    }

    public JsonArray events;
    public JsonObject user;
}
