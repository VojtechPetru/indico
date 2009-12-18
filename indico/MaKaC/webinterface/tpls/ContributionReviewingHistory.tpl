<% declareTemplate(newTemplateStyle=True) %>
<% import MaKaC.webinterface.urlHandlers as urlHandlers %>
<% from MaKaC.conference import LocalFile %>
<% from MaKaC.conference import Link %>

<% for review in Versioning: %>

    <% if review.getRefereeJudgement().isSubmitted(): %>
        <table width="90%%" align="center" border="0" style="padding-bottom: 10px;">
		    <tr>
		        <td colspan="3" class="groupTitle" style="width: 60%;padding-top:20px; border-bottom: none">
		          <%= _("Judgement details for ")%><%= _("Review ")%> <%= review.getVersion() %>
		        </td>
		    </tr>
		    <tr>
            <tr>
            <td colspan="2" class="dataCaptionTD" style="padding-right: 1px">
                    <span class="titleCellFormat"><strong><%= _("Material:")%></strong></span>
            </td>
            <td>
             <% for m in review.getMaterials(): %>
                <% for res in m.getResourceList(): %>
                    <span style="border-right:5px solid #FFFFFF;border-left:5px solid #FFFFFF;">
                    <% if isinstance(res, LocalFile): %>
                        <a href="<%= urlHandlers.UHFileAccess.getURL(res) %>">
                    <% end %>
                    <% elif isinstance(res, Link) :%>
                        <a href="<%= res.getURL() %>">
                    <% end %>
                        <%= res.getName() %>
                    </a>
                    </span>
                <br/>
                <% end %>
            <% end %>
            </td>
           </tr>
        </table>
        <% includeTpl ('ContributionReviewingDisplay',
                        Editing = review.getEditorJudgement(), AdviceList = review.getReviewerJudgements(), Review = review,
                        ConferenceChoice = ConferenceChoice) %>
        
    <% end %>
<% end %>