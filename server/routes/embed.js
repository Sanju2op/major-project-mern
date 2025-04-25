const express = require("express");
const router = express.Router();
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");

// Get embed script for a space
router.get("/:spaceId", async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId);
    if (!space) {
      return res.status(404).send("Space not found");
    }

    // Get approved testimonials for the space
    const testimonials = await Testimonial.find({
      space: req.params.spaceId,
      status: "approved",
    }).populate("author");

    // Generate the embed script
    const script = `
      (function() {
        const testimonials = ${JSON.stringify(testimonials)};
        const container = document.createElement('div');
        container.className = 'testimonials-container';
        container.style.cssText = 'max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;';
        
        testimonials.forEach(testimonial => {
          const card = document.createElement('div');
          card.className = 'testimonial-card';
          card.style.cssText = 'background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
          
          const header = document.createElement('div');
          header.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px;';
          
          const avatar = document.createElement('img');
          avatar.src = testimonial.author.avatar || 'https://placehold.jp/34/3d4070/ffffff/150x150.png?text=Not%20Uploaded';
          avatar.style.cssText = 'width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;';
          
          const authorInfo = document.createElement('div');
          authorInfo.innerHTML = \`
            <h3 style="margin: 0; font-size: 18px; color: #333;">\${testimonial.author.name}</h3>
            <p style="margin: 5px 0 0; font-size: 14px; color: #666;">\${testimonial.author.company || ''}</p>
          \`;
          
          header.appendChild(avatar);
          header.appendChild(authorInfo);
          
          const content = document.createElement('p');
          content.style.cssText = 'color: #444; line-height: 1.6; margin: 0;';
          content.textContent = testimonial.content;
          
          if (testimonial.rating) {
            const rating = document.createElement('div');
            rating.style.cssText = 'margin: 10px 0;';
            rating.innerHTML = \`⭐ \${testimonial.rating}/5\`;
            card.appendChild(rating);
          }
          
          card.appendChild(header);
          card.appendChild(content);
          
          if (testimonial.socialLinks?.twitter || testimonial.socialLinks?.instagram) {
            const socialLinks = document.createElement('div');
            socialLinks.style.cssText = 'margin-top: 15px;';
            
            if (testimonial.socialLinks.twitter) {
              const twitterLink = document.createElement('a');
              twitterLink.href = testimonial.socialLinks.twitter;
              twitterLink.target = '_blank';
              twitterLink.style.cssText = 'color: #1DA1F2; text-decoration: none; margin-right: 15px;';
              twitterLink.textContent = 'Twitter';
              socialLinks.appendChild(twitterLink);
            }
            
            if (testimonial.socialLinks.instagram) {
              const instagramLink = document.createElement('a');
              instagramLink.href = testimonial.socialLinks.instagram;
              instagramLink.target = '_blank';
              instagramLink.style.cssText = 'color: #E1306C; text-decoration: none;';
              instagramLink.textContent = 'Instagram';
              socialLinks.appendChild(instagramLink);
            }
            
            card.appendChild(socialLinks);
          }
          
          container.appendChild(card);
        });
        
        document.currentScript.parentNode.insertBefore(container, document.currentScript);
      })();
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.send(script);
  } catch (error) {
    console.error("Error generating embed script:", error);
    res.status(500).send("Error generating embed script");
  }
});

module.exports = router;
