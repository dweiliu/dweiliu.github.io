$(document).ready(function() {

  var socialMenu = function(){
    $('.icon-share2').on('click',function(){
      $('.micrositeSocialMenu').toggleClass('show');
      $('.sponsorInfoPanel.show').removeClass('show');
      $(this).toggleClass('active');
      $('#sponsoredBy i').removeClass('active');
    });
  }

  var sponsoredContent = function(){
    $('#sponsoredBy').on('click',function(){
      $('.sponsorInfoPanel').toggleClass('show');
      $('.micrositeSocialMenu.show').removeClass('show');
      $(this).find('i').toggleClass('active');
      $('.icon-share2').removeClass('active');
      $('.sponsoredByText').toggleClass('hide');
    });
  }

  var hidePopups = function(){
    $('.sponsorInfoPanel,.micrositeSocialMenu').removeClass('show');
    $('#sponsoredBy i,.icon-share2').removeClass('active');
    $('.sponsoredByText').removeClass('hide');
  }

  var headerNavActiveTab = function(){
    $('#tabDropDown a').text($('#navList .activeTab').text());
  }

  var tabSelection = function(){

    $('#navList li').each(function(){
      $(this).on('click',function(){
        // $(this).addClass('activeTab');
        // $('#navList li').not($(this)).removeClass('activeTab');
        // headerNavActiveTab();
        $('#navList').removeClass('show');
      });
    });

    $('#tabDropDown').on('click',function(){
      $('#navList').toggleClass('show');
    });
  }

  var contentViewer = function(){

    var assetsListingCount = $('#assetsList li').length;

    $('.assetListingExpand').click(function(){
      $('#assetsList li:nth-child(n+4)').addClass('open');
      $(this).remove();
      $('#assetListingFader').remove();
    })

    /*
      Hide Load More option when there are 3 or fewer assets
    */
    if($(window).width() < 960){
      if(assetsListingCount > 3) {
        $('.assetListingExpand').show();
      }
    } else if ($(window).width() >= 960){
      if(assetsListingCount > 10) {
        $('.assetListingExpand').show();
      }
    }

    // if(assetsListingCount%2 === 0 ) {
    //   $('#assetsList li:nth-last-child(2)').addClass('penultimate');
    // }
  }

  if(typeof socialFeed !== 'undefined' && socialFeed == true){
    var socialFeedHasAccounts = [socialFeedHasTwitter, socialFeedHasFacebook, socialFeedHasRSS];
    var socialFeedAccountsCounter = socialFeedHasAccounts.length;

    var socialFeedAccountsTotal = 0;

    for (var i = 0; i < socialFeedAccountsCounter; i++) {
      if(socialFeedHasAccounts[i] == true){
        socialFeedAccountsTotal++;
      }
    }

    $('#micrositeSocialFeeds').addClass('count' + socialFeedAccountsTotal);

    var socialFeedTabNavigation = function(){
      var activeTab = 'micrositeSocialFeedNav' + startActive + 'Tab';

      $('.' + activeTab).addClass('active');

      var activePanel = 'micrositeSocialFeedNav' + startActive + 'Panel';

      $('.' + activePanel).css('display','block');


      function selectTab(){
        $('.micrositeSocialFeedNavRSSTab').click(function(){
          activeTab = 'rss';
        })
        $('.micrositeSocialFeedNavFacebookTab').click(function(){
          activeTab = 'facebook';
        })
        $('.micrositeSocialFeedNavTwitterTab').click(function(){
          activeTab = 'twitter';
        })
      }

      function loadPanel(){

        if($('.micrositeSocialFeedNavRSSTab').hasClass('active')){
          $('.micrositeSocialFeedRSSPanel').css('display','block');
          $('.micrositeSocialFeedTwitterPanel').css('display','none');
          $('.micrositeSocialFeedFacebookPanel').css('display','none');
          $('.micrositeSocialFeedFooter').html('<a href=' + rssLink + ' target="_blank"><div class="micrositeSocialFeedFooterCTA">View more blog posts</div></a>');
          // $('.micrositeSocialFeedFooterCTA').html('<a href=' + rssLink + ' target="_blank">View more blog posts</a>');
        } else if ($('.micrositeSocialFeedNavTwitterTab').hasClass('active')){
          $('.micrositeSocialFeedTwitterPanel').css('display','block');
          $('.micrositeSocialFeedRSSPanel').css('display','none');
          $('.micrositeSocialFeedFacebookPanel').css('display','none');
          $('.micrositeSocialFeedFooterCTA').html('Follow ' + twitterAccountName).wrap('<a href=' + twitterLink + ' target="_blank"></a>');
          // $('.micrositeSocialFeedFooterCTA').html('<a href=' + twitterLink + ' target="_blank">Follow ' + twitterAccountName + '</a>');
        } else if ($('.micrositeSocialFeedNavFacebookTab').hasClass('active')){
          $('.micrositeSocialFeedFacebookPanel').css('display','block');
          $('.micrositeSocialFeedRSSPanel').css('display','none');
          $('.micrositeSocialFeedTwitterPanel').css('display','none');
          $('.micrositeSocialFeedFooterCTA').html('Like us at ' + facebookAccountName).wrap('<a href=' + facebookLink + ' target="_blank"></a>');
          // $('.micrositeSocialFeedFooterCTA').html('<a href=' + facebookLink + ' target="_blank">Like us at ' + facebookAccountName + '</a>');
        }
      }

      loadPanel();
      selectTab();

      $('.micrositeSocialFeedNav ul li').on('click',function(e){
        e.preventDefault();

        if($(this).siblings().hasClass('active')){
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
        }

        loadPanel();
      });
    }

    var errorStructure = '<div class="socialFeedMissingErrorMessage"><h2>Sorry</h2><p>Feed is temporarily unavailable.</p></div>';

    var getRSSFeed = function(){

      var host = (window.location.hostname.indexOf('.eng.') != '-1') ? 'yahooql.eng.techtarget.com' : (window.location.hostname.indexOf('.qa.') != '-1') ? 'yahooql.qa.techtarget.com' : 'yahooql.techtarget.com';

      $('.viewAllBlogPosts').attr('href',rssFeedSource);

      var rssStructure = '<li class="rssRow"><h4></h4><span class="rssPubDateDay"></span> <span class="rssPubDate"></span></div><p class="rssLink"></p></li>';

      $.ajax({
        type:'GET',
        url:'https://' + host + '/rss_json.php?rssFeedSource='+encodeURIComponent(rssFeedSource),
        dataType:'jsonp',
        crossDomain: true,
        success: function(rssFeed){
          if(typeof rssFeed.query === 'undefined') {
            $('.spinnerRSS').css('display','none');
            $('.micrositeSocialFeedRSSPanel #rssFeed').html('<p class="errorMessage">There was an error loading the RSS feed. <a href="' + rssLink + '" target="_blank">Visit the feed directly here.</a></p>');
          } else {
            $('.spinnerRSS').css('display','none');
            for(i = 0; i < 3; i++) {
              $('.micrositeSocialFeedRSSPanel #rssFeed ul').append(rssStructure);
              // Convert date format from "Fri, 19 Jun 2015 14:34:23 GMT" to "19" and "JUN15"
              rssDateNativeFormat = rssFeed.query.results.item[i].pubDate;
              rssDateSplitFormat = rssDateNativeFormat.split(' ');
              rssDateDayofMonth = rssDateSplitFormat[1];
              var rssDateYear4 = rssDateSplitFormat[3];
              rssDateMonthYear = rssDateSplitFormat[2] + rssDateYear4.substr(2);

              $('.rssRow:nth-of-type(' + (i+1) + ') .rssPubDateDay').html(rssDateDayofMonth);
              $('.rssRow:nth-of-type(' + (i+1) + ') .rssPubDate').html(rssDateMonthYear);
              $('.rssRow:nth-of-type(' + (i+1) + ') h4').html('<a href="' + rssFeed.query.results.item[i].link + '" target="_blank" + data-track="' + rssFeed.query.results.item[i].link + '" title="View this feed">' + rssFeed.query.results.item[i].title + '</a>');
              $('.rssRow:nth-of-type(' + (i+1) + ') .rssLink').html('<a href="' + rssFeed.query.results.item[i].link + '" target="_blank" + data-track="' + rssFeed.query.results.item[i].link + '" title="View this feed">Read More</a>');
            }
            $('.viewAllBlogPosts').css('display','block');
          }
        }
      });

    }

    var getTweets = function(){

      // var host_LI = 'twitter.eng.techtarget.com'; // Testing
      var host_LI = (window.location.hostname.indexOf('.eng.') != '-1') ? 'twitter.eng.techtarget.com' : (window.location.hostname.indexOf('.qa.') != '-1') ? 'twitter.qa.techtarget.com' : 'twitter.techtarget.com';

      var numTweets = 12; // Number of tweets to retrieve.
      var tweetId = 0; // Unique number which is associated to each individual tweet. Used to construct URLs for intents.

      // Structure per tweet. Customize away!
      var tweetStructure = '<li class="clearfix"><div class="twitterAvatarContainer"><img class="twitterAvatar"/></div><div class="tweetContent"><p><a class="twitterUserName" data-tweet-id="placeholder" target="_blank"></a> <a class="twitterUserHandle1" data-tweet-id="placeholder" target="_blank"></a><a class="tweetDate" data-tweet-id="placeholder" target="_blank"></a><br/><a class="twitterUserHandle2" data-tweet-id="placeholder" target="_blank"></a></p><div class="tweet" ><span class="tweetText"></span></div></div><div class="tweetIntents"></div></li>';

      var urlRE = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
      var hashtagRE = /#(\S+)/g;
      var handleRE = /@(\S+)/g;

      var tweetText = new String();
      var tweetDateNativeFormat = new String();
      var tweetDateCorrectFormat = new Array();

      // Build out structure based on number of tweets we're getting back.
      for(i = 0; i < numTweets; i++) {
        $('.tweets').append(tweetStructure);
      }

      $.ajax({
        type:'GET',
        url:'https://' + host_LI + '/twitter_json.php?count='+numTweets+'&screen_name='+twitterAccount,
        dataType:'jsonp',
        crossDomain: true,
        success: function(listTweets){
          $('.spinningBoxes').css('display','none');
          $('#twitterfeed').css('display','block');

          var tweetIntentRetweeted;
          var tweetIntentFavorited;

          for(i = 0; i < numTweets; i++) {
            tweetId = listTweets[i].id_str;
            $('.tweets li:nth-of-type(' + (i+1) + ') a').attr('data-tweet-id', listTweets[i].id_str);
            $('.tweets li:nth-of-type(' + (i+1) + ') .tweetDate').attr('href','https://twitter.com/' + twitterAccount + '/status/' + listTweets[i].id_str);
            $('.tweets li:nth-of-type(' + (i+1) + ') .twitterUserName').html(listTweets[i].user.name).attr('href','https://twitter.com/' + twitterAccount);
            $('.tweets li:nth-of-type(' + (i+1) + ') .twitterUserHandle1').html(' @' + listTweets[i].user.screen_name).attr('href','https://twitter.com/' + twitterAccount);
            $('.tweets li:nth-of-type(' + (i+1) + ') .twitterUserHandle2').html(' @' + listTweets[i].user.screen_name).attr('href','https://twitter.com/' + twitterAccount);
            $('.tweets li:nth-of-type(' + (i+1) + ') .twitterAvatar').attr('src', listTweets[i].user.profile_image_url);

            // Convert Twitter created_at format from "Fri Feb 27 00:24:55 +0000 2015" to "Feb 27"
            tweetDateNativeFormat = listTweets[i].created_at;
            tweetDateSplitFormat = tweetDateNativeFormat.split(' ');
            tweetDateCorrectFormat = tweetDateSplitFormat[1] + ' ' + tweetDateSplitFormat[2];
            $('.tweets li:nth-of-type(' + (i+1) + ') .tweetDate').html(tweetDateCorrectFormat);

            // Tweet with links to hashtag/URLs where applicable
            tweetText = listTweets[i].text;
            if(tweetText != undefined && tweetText.length != 0) {
              $('.tweets li:nth-of-type(' + (i+1) + ') .tweetText').html(tweetText.replace(
                urlRE,
                '<a class="inLineLink" href="$&" data-tweet-id="' + listTweets[i].id_str + '" target="_blank">$&</a>'
              ).replace(hashtagRE, '<a class="hashLink" href="https://twitter.com/#!/search/$1" data-tweet-id="' + listTweets[i].id_str + '" target="_blank">#$1</a>'
              ).replace(handleRE, '<a class="handleLink" href="https://twitter.com/$1" data-tweet-id="' + listTweets[i].id_str + '" target="_blank">@$1</a>'));
            }

            var removedCharacters;
            $('.inLineLink').each(function(){
              if($(this).html().substr(-1) == '.'){
                removedCharacters = $(this).html().slice(0,-1);
                $(this).attr('href', removedCharacters);
              }
            })
            $('.handleLink').each(function(){
              if($(this).html().substr(-1) == ':'){
                removedCharacters = $(this).html().slice(0,-1);
                $(this).attr('href','https://twitter.com/' + removedCharacters);
              }
            })

            // $('.micrositeSocialFeedFooter').css('display','block');

            tweetIntentRetweeted = listTweets[i].retweet_count;
            tweetIntentFavorited = listTweets[i].favorite_count;

            // Twitter intents. Reply/Retweet/Favorite
            $('.tweets li:nth-of-type(' + (i+1) + ') .tweetIntents').html('<a class="replyIntentLink" target="_blank" data-tweet-id="' + listTweets[i].id_str + '" href="https://twitter.com/intent/tweet?in_reply_to=' + tweetId + '"><i class="icon-reply"></i><span>Reply</span></a><a class="retweetIntentLink" target="_blank" data-tweet-id="' + listTweets[i].id_str + '" href="https://twitter.com/intent/retweet?tweet_id=' + tweetId + '"><i class="icon-retweet"></i><span>Retweet</span></a><span class="micrositeSocialFeedTwitterRetweeted">' + tweetIntentRetweeted + '</span><a class="favoriteIntentLink" target="_blank" data-tweet-id="' + listTweets[i].id_str + '" href="https://twitter.com/intent/favorite?tweet_id=' + tweetId + '"><i class="icon-favorite"></i><span>Favorite</span></a><span class="micrositeSocialFeedTwitterFavorited">' + tweetIntentFavorited + '</span>');


            if(tweetIntentRetweeted === 0){
              $('.tweets').find('.micrositeSocialFeedTwitterRetweeted').eq(i).css('display','none');
            }
            if(tweetIntentFavorited === 0){
              $('.tweets').find('.micrositeSocialFeedTwitterFavorited').eq(i).css('display','none');
            }

          };
        }, error: function(){
          $('.spinningBoxes').css('display','none');
          $('#twitterfeed').css('display','block').html(errorStructure);
        }
      });

    }

    var getFacebookStatuses = function(){

      // var host_LI = 'facebook.eng.techtarget.com'; // Testing
      var host_LI = (window.location.hostname.indexOf('.eng.') != '-1') ? 'facebook.eng.techtarget.com' : (window.location.hostname.indexOf('.qa.') != '-1') ? 'facebook.qa.techtarget.com' : 'facebook.techtarget.com';

      // Structure per status. Customize away!
      var facebookStatusStructure = '<li><p><a href="" target="_blank" class="facebookLink"><span class="facebookUser"></span></a><a href="" target="_blank" class="facebookLink"><span class="facebookStatusDate"></span></a></p><div class="facebookStatuses"><a href="" target="_blank" class="facebookLink"><p class="facebookStatus"></p></a><p class="facebookCTA"><a href="" target="_blank" class="facebookLink"><span>View Now</span></a></p></div></li>';

      // Regular Expression for finding URLs
      var urlRE = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;

      var numStatuses = 10;

      var facebookPostPoster = new String();
      var facebookPostURLNative = new String();
      var facebookPostURLFinal = new String();
      var facebookPostPicture = new String();
      var facebookPostTimeNative = new String();
      var facebookPostTimeFinal = new String();
      var facebookStatusText = new String();
      var month;
      var months = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');

      $.ajax({
        type:'GET',
        url:'https://' + host_LI + '/facebook_json.php?facebookName='+facebookAccount+'&facebookCount='+numStatuses,
        dataType:'jsonp',
        crossDomain: true,
        success: function(listStatuses){

          if(listStatuses){
            $('#facebookfeed').css('display','block');

            for(i = 0; i < numStatuses; i++) {
              $('.facebookstatusupdates').append(facebookStatusStructure);

              // facebookPostPoster = listStatuses.data[i].from.name;
              facebookPostURLNative = listStatuses.data[i].id.split('_');
              facebookPostURLFinal = "https://www.facebook.com/" + facebookPostURLNative[0] + '/posts/' + facebookPostURLNative[1];
              // $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookUser').html(facebookPostPoster);
              $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookLink').attr('href',facebookPostURLFinal);
              $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookStatus').html(listStatuses.data[i].message);

              facebookPostPicture = listStatuses.data[i].picture;
              if (facebookPostPicture != undefined){
                $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookStatusPictureContainer').css('display','block');
                $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookStatusPicture').css('display','block');
              } else {
              }

              // Convert Facebook created_time format from "2015-02-03T02:08:25+0000" to "Feb 03"
              facebookPostTimeNative = listStatuses.data[i].created_time.split('-');
              month = parseInt(facebookPostTimeNative[1]);
              facebookPostTimeFinal = months[month - 1] + ' ' + facebookPostTimeNative[2].substring(0,2);
              $('.facebookstatusupdates li:nth-of-type(' + (i+1) + ') .facebookStatusDate').html(facebookPostTimeFinal);
            };
            $('.spinningBoxes').css('display','none');
          } else {
            $('.spinningBoxes').css('display','none');
            console.log('wtf');
            $('.micrositeSocialFeedFacebookPanel').html(errorStructure);
          }
        }, error: function(){
          $('.spinningBoxes').css('display','none');
          $('#facebookFeed').css('display','block');
          $('.micrositeSocialFeedFacebookPanel').html('hi!');
        }
      });

    }
    if(socialFeedHasAccounts[0] == true){
      var twitterAccount = socialFeedTwitterAccount;
      var twitterLink = 'https://twitter.com/@' + twitterAccount;
      var twitterAccountName = socialFeedTwitterAccountName;
      $('.micrositeSocialFeedNav ul').append('<li class="micrositeSocialFeedNavTwitterTab"><i class="icon-twitter"></i><span>Latest Tweets</span></li>')
      $('.micrositeSocialFeedContent > ul').append('<li class="micrositeSocialFeedTwitterPanel"><div id="twitterfeed"><ul class="tweets"></ul></div></li>')
      getTweets();
    }

    if(socialFeedHasAccounts[1] == true){
      var facebookAccount = socialFeedFacebookAccount;
      var facebookLink = 'https://www.facebook.com/' + facebookAccount;
      var facebookAccountName = socialFeedFacebookAccountName;
      $('.micrositeSocialFeedNav ul').append('<li class="micrositeSocialFeedNavFacebookTab"><i class="icon-facebook"></i><span>Latest Updates</span></li>')
      $('.micrositeSocialFeedContent > ul').append('<li class="micrositeSocialFeedFacebookPanel"><div id="facebookfeed"><ul class="facebookstatusupdates"></ul></div></li>')
      getFacebookStatuses();
    }

    if(socialFeedHasAccounts[2] == true){
      var rssFeedSource = socialFeedRSSAccount;
      var rssLink = socialFeedRSSLinkURL;
      $('.micrositeSocialFeedNav ul').append('<li class="micrositeSocialFeedNavRSSTab"><i class="icon-rss"></i><span>Latest Posts</span></li>')
      $('.micrositeSocialFeedContent > ul').append('<li class="micrositeSocialFeedRSSPanel"><div id="rssFeed"><ul></ul></div></li>')
      getRSSFeed();
    }

    $(window).on('scroll',function(){
      if($('.sponsorInfoPanel').hasClass('show') && $(window).scrollTop() > $('.header').outerHeight(true) || $('.micrositeSocialMenu').hasClass('show') && $(window).scrollTop() > $('.header').outerHeight(true)){
        hidePopups();
      }
    });
    socialFeedTabNavigation();
  }

  var abstractHeaderHTML = function(){
    if ($('body#bprAbstractOneReg')){
      $('#abstractHeader').html('<div id="headerOuterContainer"><div id="headerInnerContainer"><div id="sponsorBar"><div id="sponsorBarContainer"><div id="socialMenu"><i class="icon-share2"></i><div class="micrositeSocialMenu"><div class="share-bar-container"><ul class="share-bar"><li title="Like/Share on Facebook" data-socialsite="facebook" class="share-bar-item share-bar-item-desktop socialMedia-facebook"><a href="#"><i data-icon="u" class="icon"></i></a></li><li title="Share on Twitter" data-socialsite="twitter" class="share-bar-item share-bar-item-desktop socialMedia-twitter"><a href="#"><i data-icon="c" class="icon"></i></a></li><li title="Share on LinkedIn" data-socialsite="linkedin" class="share-bar-item share-bar-item-desktop socialMedia-linkedin"><a href="#"><i data-icon="o" class="icon"></i></a></li><li title="Email a Friend" class="share-bar-item share-bar-item-desktop contentTools-email"><a href="https://api.addthis.com/oexchange/0.8/forward/email/offer?pubid=uxtechtarget&amp;url=https%3A%2F%2Fpreview.techtarget.com%3A8080%2Fibmbizconnect%3Fvgnextrefresh%3D1%233744114142001&amp;title=Managing+the+%22Smart+Enterprise%22&amp;email_template=TechTargetSearchSites&amp;ct=1"><i data-icon="n" class="icon"></i></a></li></ul></div></div></div><div id="sponsoredBy"><p class="sponsoredByText">Sponsored Content </p><i class="icon-info"></i><div class="sponsorInfoPanel"><p>Sponsored content is a special advertising section provided by IT vendors. It features educational content and interactive media.</p></div></div></div></div><div id="micrositeHeader"><a class="clientLogo"></a></div><div id="headerContainerClear"></div></div></div>');
    }
  }

  var pushwooshTest = function(){
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }

    registerServiceWorker();

    function registerServiceWorker() {
      return navigator.serviceWorker.register('pushwoosh-service-worker.js')
      // return navigator.serviceWorker.register('javascript/pushwoosh-service-worker.js')
      .then(function(registration) {
        console.log('Service worker successfully registered.');
        return registration;
      })
      .catch(function(err) {
        console.error('Unable to register service worker.', err);
      });
    }

    askPermission();

    function askPermission() {
      return new Promise(function(resolve, reject) {
        $('#wayFinderContainer h1').click(function(){
          console.log('reg-try');
          console.log('ask the pemission');
          const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
          });

          if (permissionResult) {
            permissionResult.then(resolve, reject);
          }
        });
      })
      .then(function(permissionResult) {
      console.log('reg-granted?' + permissionResult);
      if (permissionResult !== 'granted') {
          throw new Error('We weren\'t granted permission.');
        }
      });
    }

    // subscribeUserToPush();
    function subscribeUserToPush() {
      return getSWRegistration()
      .then(function(registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BCMWigmFf5y9YCEYbepq4mY7cjueKOlqd2C-vbCdJOKYxrTiMJVQQRlH0hMGMv_vFyzmEeqO4mrEIB-5A9V5wWs'
          )
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(function(pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
      });
    }

		
  }

 
  socialMenu();
  headerNavActiveTab();
  tabSelection();
  contentViewer();
  abstractHeaderHTML();
  sponsoredContent();
  pushwooshTest();

  $(window).on('resize',function(){
    if($(window).width() < 960){
      if($('#assetsList li').length > 3) {
        $('.assetListingExpand').show();
      }
    } else if ($(window).width() >= 960){
      if($('#assetsList li').length > 10) {
        $('.assetListingExpand').show();
      } else {
        $('.assetListingExpand').hide();
      }
    }
  });

});
