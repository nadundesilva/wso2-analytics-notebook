package org.wso2.carbon.notebook.commons.response;

/**
 * Used for returning the status of a request sent to the server
 */
public class Response {
    private String status;

    public Response(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
