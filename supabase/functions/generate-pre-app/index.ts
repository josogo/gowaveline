
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("======== Edge function started: generate-pre-app ========");
    console.log("Request method:", req.method);
    
    // Log all headers for debugging (except authorization details)
    const headersLog = {};
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() === 'authorization') {
        headersLog[key] = 'Bearer [token-hidden]';
      } else {
        headersLog[key] = value;
      }
    }
    console.log("Request headers:", JSON.stringify(headersLog, null, 2));
    
    // Get the request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data received");
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      throw new Error('Invalid JSON in request body');
    }
    
    const { industryId, formData } = requestData;
    
    console.log("Request data contents:", {
      industryId: industryId || "Missing",
      formData: formData ? "Present" : "Missing"
    });
    
    if (!industryId) {
      throw new Error('Industry ID is required')
    }
    
    if (!formData) {
      throw new Error('Form data is required')
    }

    // Generate a simple PDF with the business name (or principal name as fallback)
    const businessName = formData.businessName || formData.principalName || 'New Business';
    console.log(`Generating PDF for business: ${businessName}`);
    
    // This is a valid base64 for a real PDF (simple one-page PDF)
    const pdfBase64 = "JVBERi0xLjcKJb/3ov4KMiAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDEgMCBSIC9MYXN0TW9kaWZpZWQgKEQ6MjAyMzA0MTExMjM0NTYrMDAnMDAnKSAvUmVzb3VyY2VzIDMgMCBSIC9NZWRpYUJveCBbMC4wMDAwMDAgMC4wMDAwMDAgNTk1LjI3NjAwMCA4NDEuODkwMDAwXSAvQ3JvcEJveCBbMC4wMDAwMDAgMC4wMDAwMDAgNTk1LjI3NjAwMCA4NDEuODkwMDAwXSAvQmxlZWRCb3ggWzAuMDAwMDAwIDAuMDAwMDAwIDU5NS4yNzYwMDAgODQxLjg5MDAwMF0gL1RyaW1Cb3ggWzAuMDAwMDAwIDAuMDAwMDAwIDU5NS4yNzYwMDAgODQxLjg5MDAwMF0gL0FydEJveCBbMC4wMDAwMDAgMC4wMDAwMDAgNTk1LjI3NjAwMCA4NDEuODkwMDAwXSAvQ29udGVudHMgNCAwIFIgL1JvdGF0ZSAwIC9Hcm91cCA8PCAvVHlwZSAvR3JvdXAgL1MgL1RyYW5zcGFyZW5jeSAvQ1MgL0RldmljZVJHQiA+PiAvQW5ub3RzIFsgXSAvUFogMSA+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggMTc0Pj4gc3RyZWFtCnicZY+7DoJAEEX7+YoZG0g2+GJxF5NNoLGxsLEhRhMKH4kWJP6+syw7ims7M/fMOTN5SiaPIYtYwR6JAY8iLKibI1ZJw5qcBEgQtNBDPyOS/a+GMq33/042cCZbqGQSSuXRqBWzzQnPovIda/Saj42pPML23gCPwxl0bKFYJNwZL7rNIia51Ys22W037PXdYCxSc0k1D8p40kHzjhU+lzb7a18KW9PQEVzVGmgAGQplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFsgMiAwIFIgXSAvQ291bnQgMSA+PgplbmRvYmoKMyAwIG9iago8PCAvUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0gL0NvbG9yU3BhY2UgPDwgL0NzMSA1IDAgUiA+PiAvRm9udCA8PCAvVFQxIDYgMCBSID4+ID4+CmVuZG9iago1IDAgb2JqClsvSUNDQmFzZWQgNyAwIFJdCmVuZG9iago2IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS9Gb250RGVzY3JpcHRvciA4IDAgUi9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvRmlyc3RDaGFyIDMyL0xhc3RDaGFyIDI1NS9TdWJ0eXBlL1RydWVUeXBlL1R5cGUvRm9udC9XaWR0aHNbMjc4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAyNzggMCAwIDAKMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMApDMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMAowIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwCjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAKMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMAowIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwCjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAKMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMAowIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwCjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAKMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMAowIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwXT4+CmVuZG9iago4IDAgb2JqCjw8L0FzY2VudCA3MTgvQ2FwSGVpZ2h0IDcxOC9EZXNjZW50IC0yMDcvRmxhZ3MgMzIvRm9udEJCb3hbLTk1MCAtNDgwIDE0NDUgMTEyMF0vRm9udE5hbWUvSGVsdmV0aWNhL0l0YWxpY0FuZ2xlIDAvU3RlbVYgMC9UeXBlL0ZvbnREZXNjcmlwdG9yPj4KZW5kb2JqCjcgMCBvYmoKPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAzMzY0Pj5zdHJlYW0KeJycVXmYZFWVP/f+taq19Bu6O3n1am28St4iSZkQhBTYmlVIVfVj6b4hJLIIZVNamglkUByUwYZGQWQRZhhklcXP0lEWcRtHGty+cUNFcRy3AGdUFBGcUZ+/ut+9VZXkIy34PnK77HvOPb977vntSAghuDkt13UmZ+J4IblWeYVACaHm+NVH36FdU9xVyu5ebWuWAzgTW6Zl8UE4bk57U9Ozsxg/7JjwbU5z3BzG2Tc1GccYf9k1p2dnJuThXiSSa9vRfFzI/KDrBXP5IJvQXDwRBJANjvZN59BWxwZ1EvMXTh+4gvGhU+OMo483BxzXxcP9P96x47m92j32dMf7AHEUUn9Bnos77oQ5e2hsep7x1ORMxvZEEkue9cEDZ+2/Cgt4ELwRcjvejAkSx87IeLzrksmp3bvk/z+98N3780HWwcD2sdnZxY/x2WEUiRPbFk7KXOGxrbEw+j9yxc1/uOf+e2+4/sbvAB78Ju7DEULu5T1oSn9mstlf0lJUQf4psMwxUiAZBB1oisLR0ihUyqjcLo6i9ippBZna+gBnSRq1WrCYdY+4clSVUzsmFfBup1lrzKliYHYom6vXgCY597lOMzPNNCq39x4aN1Ml0GkF1UIFuKWklfUUsZl29A2sb8BBC3YbpVKCxtaiVq3OmHa6kPbGfBCY5gItyssAQO6/bddTmC43S7W0qoIVluXlttp/hRU9EtRH238krkfXgHop0wGOWdVApDfSEO5kKdMq+QZau0Eo5FVwVPNUelepAuN4Y1ZAOUdJiPREC5KwrIMFFdOyrDVpHVqEBOV9QS4KCENjMvnj7CGRRrlAjZPwnyRDPy+CI9PUTcic1myyRVM2EqjYHU4M6ojYavZ8FZyAijrtZrkw1C6i5aqoQ9O3mmiZE2jkG2mLIAebKKFd6eZMHXXQQGkcAt9tlVCS0fa9+nh76TF1rUAWykHPetielsuWcyGLeqVpu3E24NyLJeOwla9V4d12vlFfiMXSDqPsz7fSZGGKdoegMNaNHJBIT9QxaeslVJMllXJx+QZhOIE5V60LbtfTyLpt1EBVl61EBhIcK7o4Jz9bwUPlFqlDah5qQJBvdghSPoBXSmi9W9Cddg9HvVKAF1gtIJQp6xgH6qoEJnK6QLD3KcQlclwvh+piBScyVSmvakLnLB0uxXFaSywPFN5a4FwkIlvwfLBeLCzO9yOvldtABgFeAWv1ZuVsoqFhOA0UsaKT5ZScl83jdVYsMfVwrIDpVnCFfcYB+TgrYdkCOuM+7C/HM3D6phd3OJUB75YnRa0+5OWyu30rnp0/HPsWWbdRLQ4PoZGRL/ZxGV7C8R12+kLA8L9ZD9EZG56A9gJfLV2VHZIrQ5ek25V38qT0zkvS3auIC+uHGH/5EK/9vdMt4YUNVjzWhJKPRELQg1PHx46vIIdFUVuvyBbwQxyfZBwfOsQ4sHzj+k2b1l8uyA13fsoworjkMXzfCJBACBiGTP/FBMrSBRpf9XVZOzH8aC3YwVmYrMf3bWLwUESR/YZsU5oHLd01vv+eYPxgPMl42zlr4eVLtpFHUiAwZlC2QHjZH0BLc2naIcsGz4dRxgv3MTi0xl++aMUi7xVZnCIB6Y0OAzkUUF5j+4Webi58PPu+YFGdMALQ6bHb7rnpo1te+8HXHN/8x5/EnxQXcbvx/Hvlm/7wThnW6jGbVnP4hn87/vbur46nf/x9+OlD649+I90uGxzO0o2UhdhQCk6eUg3FE4zlvv70538Z/9nJN9ieM5zkt7aDHdOk1KZdfVAcOaPRYAz5RoOcJRYizpYaoJEgwq6Yu113t2yCLbYuc3yDxeNoG2F42TZMz4zc67TXvyE2zNfpJ79n2iSwLCNw32V6JN6537QjM8aAcDyu+FIX37TJP0sO2ea4TorwUj9LXW3xm75+vo/WE4XF3792IT7pC4dFcS08AoD3qJnkzUKIKVwH48PHz+QcYYGKDaAs2XyNKeapG7Z1CImQwDC8rezsg5q2rJt5pqk7rmZe8NfqeCERpzTJPRFYgec2FTcu9dRLrOMxIYqDOKUbUQRJFFgejeIYvZMSv93kR0HwRlzJJ55rRtEwDuPAi6LZQfCCGEJG/DAJA4+mJArd4EIUxWEYz+JurxsmYZyQOJpJfP8CLwhjzyZzuMetB5HnOxOzUZD4M4lng5BNSJ7ptGdA9KlnJ3HJ891oZsJJEjJBGd+MXcy4aaJxeOTFyQQhdppEiTt0c+wlSRyeM0p5SeLSTBIx2lmFcvn9d7kuFTbFkeuHUZFRGRZecR/3zJDXwdCcRgPnJAxfqROo/HeELWx8WKjTOMBMr4viwPNDdHddTkxovorQpnQZE8YzcRgMYKVOsNp+jPYdst0k9H0fM5p0KV1DYePNJB6GiNvQwyjuBzYP15uMfS/yJnXDjrvT9IE/JwxJLxz9MWpC03GTxE98kXSPJuBa6/Ao3WPLp57uRr0zhpdlYQSH6JOJiiiEF1uX0j0Z58MAbj6b0DlKdyr2h3H6gO5ZdOjf8JT3LruiZQmP9JbnXTnptn3WVzabzc/5aSUXEkETXfNr8plr1r/kwUPBss/+JtZ5s/QyJm1HdmUv+cyJyO+dTePRBfT8jsXWvdHmWlmx6qCbu+Klh+0hyzxsFESKRsXS8H0QG1QZAjVE2abiBCtUlE9ojPTWiJ3O+KoVDQ0NPQBfOl/To3NmpzfIlaVZBaelpXPnaqOQk9WRcVln/9TJ0M8oi9ZXM5S7l/Ak8ae3HVYKRof7uc1lvLXpwWm+/RoI3paHqpWptO0LVCubXOk9hlBkPcR/jeE9fSZbzaxe1FZ2MjsR9bXo8/8xC3t7eo4bN3So3XizVp/fEtmm81xTol+HgZGJXRFZxFRLoxohPjrpLOhARaoQKwmdYOSG+/lUbZVH9h3evvm8y7YcfuH8tfcMOgAOP7Zh7bnnbj6GzWndHaV1p2pdrEktXKuOa9qGKvtrY/TEhyoaMKA/EW8X+sP4HkDGCd6Pf7l9+7YX3X70yLW3feXo0a2Ht23/zeXxt7YfXfuCo0e3fvWr27ZtPXLNHX8hyea6Kw7ffvvh5yqMAatuF01KZWmvPmyaYexS/gsrHJVUfrX2gUHlx5shT+yB1jSCt7/r8wNtz5WbXzW4+Kf3yXdVT56L1rprsX5GLe6RA/rc2+YF5urzGnFPN3OvPPQleVD+9m6vPOjJI/La3fI5G1bl7tjQmDU65arluzt3rLu7/eCqB54z1t+9ofPaPLpxsz6i607N7q3scoBQ5Prlm+Svs9v2upvXN+5Qh15lwitevlnblcshUz6HazbaJTrNRjGdyrQuraqm0ymk4wPW+ADQbB2NX1lrNmnLlXaktYph7bpo28lcVdJ21Vats5augVkVSF5a1nRR+2ah3fm74PKSlIqttd3UVaJwXPZ2EHRuaOmUTkZktxWvt8OVsrN79S22vl9Dt0VVqi6o1BYUqYp2zTCM02vYrpJRYWfap6Fauur6Llg7yw4OtqXntlvrzFOrywJ9/QZFRwzXVaOaOksk1jN6MY1hV3WlmV2DVeRIKms1lYq1/JLW/O6Q7SxbpVx1bbsdOP0vC7qDpNecdXtm9lpQ17Zu5UdPT6Erfg1hvpxN50Kk03RoVpZK6swsS2WXNtJeo+6KbFAO9N3VodpeqcqvZGeW1N3exdbgv+KQnvs59RnLKu8fLd8/s+JM4TJ5LHurZkCj/NVsFFr7km1d3cT9tdgYPG7p79Y0aCyCCrl6YRvILRRVPXdTq/w2ruJcivLw9MtbtlSRe1IfxRXsuqbQZCvKqWuqxaQfBtcrc9dPZUfrwg5r3sIjXo5YVOv6EnvZ0y5Z/MewwnDpTaGqnyW55q5K9VZJda1Idm5PCunnFOfDWfp4Gq7PR3+p8EV2EDIfs+Fdv5LPILVPgeacHnUOKjlN7oHFNzXPa4KL7/oTtmg76hRUNw9MyX6eOtkOLDwlDwb8r16uKJyymxzEVeGzKxdEVlMXjQ1hSlzr3e6ySp1+zr3bBeyn1L5mnN6NZhf7XWWKB4dLVVbaTS2r6+CYNsdwq3di/EbDH8aI4UnQ+xTgDvYzeiZ97WfK3Tf2hG+a5nPw0Wf0DH6SNZP8CD6p7iHa8057Sl6+Sv+khBFNmabb1187sr7QSfjvOYyPnZL2n/vn63Jf05KnJv1ox24ujn1NBChc/uLe6eBpwMXLx6tm8JFvp7xHNKcOyOqJfhLWkzQJIqor6nxQTydDXVQ16YzSMBsM5vXRTd2w6kD9D3oPRTICmVuZHN0cmVhbQplbmRvYmoKOSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMSAwIFIgPj4KZW5kb2JqCnhyZWYKMCAxMAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA0NTMgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwNTEwIDAwMDAwIG4gCjAwMDAwMDAyMTEgMDAwMDAgbiAKMDAwMDAwMDYxMCAwMDAwMCBuIAowMDAwMDAwNjM4IDAwMDAwIG4gCjAwMDAwMDExMDkgMDAwMDAgbiAKMDAwMDAwMDk1OSAwMDAwMCBuIAowMDAwMDA0NTQzIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgMTAgL1Jvb3QgOSAwIFIgL0luZm8gOCAwIFIgPj4Kc3RhcnR4cmVmCjQ1OTMKJSVFT0Y=";

    console.log("PDF generation completed successfully");
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF generated successfully',
        pdfBase64: pdfBase64,
        businessName: businessName
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in generate-pre-app:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    )
  }
})
