#include "boilerplate_plugin.h"

static uint8_t count_screens(uint8_t screen_array) {
    uint8_t total = 0;
    uint8_t scout = 1;
    for (uint8_t i = 0; i < 8; i++) {
        if (scout & screen_array) total++;
        scout <<= 1;
    }
    return total;
}

void handle_finalize(void *parameters) {
    ethPluginFinalize_t *msg = (ethPluginFinalize_t *) parameters;
    context_t *context = (context_t *) msg->pluginContext;

    context->screen_array |= SET_SEND_UI;
    context->screen_array |= SET_RECEIVE_UI;

    // EDIT THIS: Handle this case like you wish to (i.e. maybe no additional screen needed?).
    // If the beneficiary is NOT the sender, we will need an additional screen to display it.
    if (memcmp(msg->address, context->beneficiary, ADDRESS_LENGTH) != 0) {
        context->screen_array |= SET_BENEFICIARY_UI;
    }

    // EDIT THIS: set `tokenLookup1` (and maybe `tokenLookup2`) to point to
    // token addresses you will info for (such as decimals, ticker...).
    msg->tokenLookup1 = context->token_received;
    context->plugin_screen_index = SET_SEND_UI;

    msg->uiType = ETH_UI_TYPE_GENERIC;

    msg->numScreens = count_screens(context->screen_array);
    msg->result = ETH_PLUGIN_RESULT_OK;
}
