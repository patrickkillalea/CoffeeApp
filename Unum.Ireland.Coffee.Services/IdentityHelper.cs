using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web;

namespace Unum.Ireland.Coffee.Services
{
    public class IdentityHelper
    {
        private string searchXml = "<individuals maxReturned=\"20\" filter=\"{0}\"><individual><name><full/></name><activeDirectory><primaryAccount><loginId/><email/><department/></primaryAccount></activeDirectory><supervisor><name><full/></name><activeDirectory><primaryAccount><loginId/><email/><department/></primaryAccount></activeDirectory></supervisor></individual></individuals>";
        
        public string GetUserDisplayName(string lanId)
        {
            string displayName = null;

            using (PrincipalContext ctx = new PrincipalContext(ContextType.Domain, "UP"))
            {
                UserPrincipal user = System.DirectoryServices.AccountManagement.UserPrincipal.FindByIdentity(ctx, lanId);
                displayName = (user != null) ? user.DisplayName : string.Empty;
            }
            return displayName;
        }
    }
}